import {useState} from "react";
import axios from "axios";

interface Photo {
    id: number;
    photo_url: string;
}

interface UploadFilesAreaProps {
    folder: string;
    id?: string;
    onUploadSuccess?: (photos: Photo[]) => void;
}

export default function UploadFilesArea({folder, id, onUploadSuccess}: UploadFilesAreaProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<string>("");
    const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);

    function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    }

    async function uploadPhotos(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.stopPropagation();

        if (files.length === 0) {
            setStatus("Пожалуйста, выберите файлы");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images", file);
        });
        formData.append("folder", folder);

        setStatus("Загрузка...");

        try {
            const response = await axios.post<{ photos: Photo[] }>(
                "http://127.0.0.1:8000/api/upload-photos/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Ответ API upload-photos:", response.data);

            const photos = response.data.photos;

            if (!Array.isArray(photos)) {
                setStatus("Ошибка: API вернул некорректный формат данных (ожидался массив photos)");
                return;
            }

            if (photos.length === 0) {
                setStatus("Фотографии не были загружены, API вернул пустой массив");
                return;
            }

            setUploadedPhotos((prev) => [...prev, ...photos]);
            onUploadSuccess?.(photos);
            setFiles([]);
            setStatus("Файлы успешно загружены");
        } catch (error: any) {
            console.error("Ошибка загрузки файла:", error.response?.data || error.message);
            if (error.response?.data?.code === "NoSuchKey") {
                setStatus("Ошибка: Файл не найден в S3. Проверьте конфигурацию хранилища.");
            } else {
                setStatus(`Ошибка загрузки файла: ${error.message}`);
            }
        }
    }

    return (
        <div>
            <input type="file" multiple onChange={handleFilesChange}/>
            <button type="button" onClick={uploadPhotos}>
                Загрузить фото
            </button>
            <p>{status}</p>
        </div>
    );
}