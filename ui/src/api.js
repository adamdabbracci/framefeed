// const apiUrl = "http://localhost:3000"
const apiUrl = "https://tx6vmubqee.execute-api.us-east-1.amazonaws.com/dev"

export async function uploadFile(sourceUserId, targetUserIds, selectedFile, caption) {

    let uploadUrl = null

    try {
        const getUrlResponse = await fetch(`${apiUrl}/upload/get-url`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: sourceUserId,
                targetUserIds,
                fileType: selectedFile.type,
                caption,
            })
        })
    
       const jsonresult = await getUrlResponse.json()
       uploadUrl = jsonresult.url
    }
    catch(ex) {
        console.log("Exception thrown when getting upload URL:")
        console.log(ex)
    }

    console.log(`Got Upload URL`, uploadUrl)

    if (!uploadUrl) {
        alert("No upload URL returned, please try again.")
        console.log(uploadUrl)
        return null
    }

    try {
        console.log("Uploading image", uploadUrl)
        const uploadresult = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                'Content-Type': selectedFile.type
            },
            body: selectedFile,
        })

        console.log(uploadresult)

        return uploadresult
    }
    catch(ex) {
        alert("Got URL, but failed to upload. Please try again.")
        console.log("Failed to upload.")
        console.log(ex)
        return null
    }
}


export async function getFeed(userId) {
    return fetch(`${apiUrl}/${userId}/feed`)
    .then(response => response.json())
}

export async function getUsers() {
    return fetch(`${apiUrl}/users`)
    .then(response => response.json())
}
