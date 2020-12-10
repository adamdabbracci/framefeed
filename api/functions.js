const uuid = require('uuid')
const AWS = require('aws-sdk')
const sharp = require('sharp')

const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: "us-east-1",
});

let users = {
  "7777": {
    name: "Courtney and AJ",
  },
  "1289": {
    name: "Armand and Anne",
  },
  "4567": {
    name: "Meems and Gary",
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function updateUserFeed(targetUserId, uploaderUserId, path, caption) {
  console.log(`UPDATING FEEDS: `, targetUserId, uploaderUserId, path, caption)
  
  let manifest = {
    items: []
  }
  // Check if the manifest is there
  try { 
    const manifestResponse = await s3.getObject({
        Bucket: process.env.UPLOAD_BUCKET,
        Key: `${targetUserId}/manifest.json`
    }).promise()
    manifest = JSON.parse(manifestResponse.Body.toString())
  }
  catch(ex) {
    if (ex.code  === "NoSuchKey") {
      console.log("Creating manifest for user: " + targetUserId)
      const manifestResponse = await s3.putObject({
          Bucket: process.env.UPLOAD_BUCKET,
          Key: `${targetUserId}/manifest.json`,
          Body: JSON.stringify(manifest)
      }).promise()
      console.log("New manifest created")
    }
    else {
      console.log("ERROR: Unknown error when finding the manifest:")
      console.log(ex)
    }
  }

  manifest.items.unshift({
    path,
    caption,
    uploader: users[uploaderUserId].name,
  })
  
  // Write the new manifest
  console.log(`Writing new manifest for user ${targetUserId}`)
  console.log(manifest)

  try {
    const manifestResponse = await s3.putObject({
        Bucket: process.env.UPLOAD_BUCKET,
        Key: `${targetUserId}/manifest.json`,
        Body: JSON.stringify(manifest)
    }).promise()

  }
  catch(ex) {
    console.log("ERROR: Failed to create new manifest:")
    console.log(ex)
  }

  return manifest
}

module.exports.getUsers = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(users)
  }
}


module.exports.resize = async (event, context) => {

    const path = event.Records[0].s3.object.key

    try {
      console.log(`Reading image: ${path}`)
      const data = await s3.getObject({
        Key: path,
        Bucket: process.env.UPLOAD_BUCKET,
      }).promise()
      
      console.log("Got image from S3")

      const bufferedOutput = await sharp(data.Body)
        .rotate()
        .toBuffer()
      
        const destparams = {
          Bucket: process.env.UPLOAD_BUCKET,
          Key: `output/${path}`,
          Body: bufferedOutput,
          ContentType: "image"
      };

      const putResult = await s3.putObject(destparams).promise(); 

      console.log("Done resizing.")
      
    }
    catch(ex) {
      console.log("Failed to resize:")
      console.log(ex)
      return
    }


    return
};

module.exports.getUploadUrl = async (event, context) => {
    const body = JSON.parse(event.body)
    const fileType = body.fileType;
    const userId = body.userId;
    const targetUserIds = body.targetUserIds;
    const caption = body.caption;

    console.log(body)

    if (
        ["image/png", "image/jpg", "image/jpeg"].indexOf(fileType) === -1
    ) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid or unsupported file type."
            })
        }
    }

    const sourcePath = `${userId}/${uuid.v4()}.png`;

    // Create the presigned URL
    const s3Params = {
      Key:  sourcePath,
      Expires: 120,
      ContentType: fileType,
      ACL: "public-read",
      Bucket: process.env.UPLOAD_BUCKET,
      Metadata: {
        "caption": caption
      }
    };

    let uploadUrl = s3.getSignedUrl("putObject", s3Params);

    console.log("Generated presigned url with params: " + JSON.stringify(s3Params));
    console.log(uploadUrl)

    try {

      console.log(`Updating feeds for : ${targetUserIds}`)
      await asyncForEach(targetUserIds, async (targetUserId) => {
        // Update the target user's feed
        await updateUserFeed(targetUserId, userId, sourcePath, caption)
      })

      console.log("Updated all feeds.")
    }
    catch(ex) {
      console.log("Failed to update user feed:")
      console.log(ex)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: "Failed to update user feed."
        })
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        url: uploadUrl
      })
    }
};



module.exports.getFeed = async (event, context) => {
  const userId = event.pathParameters.userId
  let manifest = {
    items: []
  }
  
  try {
    const manifestResponse = await s3.getObject({
        Bucket: process.env.UPLOAD_BUCKET,
        Key: `${userId}/manifest.json`
    }).promise()
    
    manifest = JSON.parse(manifestResponse.Body.toString())
  }
  catch(ex) {
    console.log("Failed to get manifst for user: " + userId)
    console.log(ex)
  }

  const postProcessing = manifest.items.map((x) => {
    return {
      ...x,
      url: `https://${process.env.UPLOAD_BUCKET}.s3.amazonaws.com/output/${x.path}`
    }
  })

  console.log(postProcessing)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(postProcessing)
  };
}

