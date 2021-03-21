import { v4 as uuid } from 'uuid'
import path from 'path'
import fs from 'fs'
import axios from 'axios'

// fileUrl: the absolute url of the image or video you want to download
// downloadDir: the path of the downloaded file on your machine
// id: an id for the file, auto-generated if not provided
export const downloadFile = async (
	fileUrl: string,
	downloadDir: string = './images',
	id: string = uuid()
) => {
	// Create a name for the file
	const fileName = id + path.extname(fileUrl)

	// The path of the downloaded file on our machine
	const localFilePath = path.resolve(downloadDir, fileName)
	console.log('into ' + localFilePath)

	try {
		const response = await axios({
			method: 'GET',
			url: fileUrl,
			responseType: 'stream',
		})
		await response.data.pipe(fs.createWriteStream(localFilePath))
		console.log('Successfully downloaded file!')

		return fileName
	} catch (err) {
		throw new Error(err)
	}
}
