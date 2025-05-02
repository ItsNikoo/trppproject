import {useState} from "react";
import axios from "axios";

export default function Test() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadedPhoto, setUploadedPhoto] = useState(null);
    const [folder, setFolder] = useState<string>('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFolderChange = (event) => {
        setFolder(event.target.value);
    }

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/upload-photo/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log('File uploaded successfully:', response.data);
            setUploadedPhoto(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <input type="text" onChange={handleFolderChange} />
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleUpload}>Upload Photo</button>

            {uploadedPhoto && (
                <div>
                    <p>Uploaded Photo:</p>
                    <img src={uploadedPhoto.photo_url} alt="Uploaded" style={{width: '300px', marginTop: '10px'}}/>
                </div>
            )}
        </div>
    )
}