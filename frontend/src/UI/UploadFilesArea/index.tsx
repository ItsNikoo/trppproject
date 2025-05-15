import {useState, useRef} from "react";
import axios, {AxiosError} from "axios";

interface Photo {
    id: number;
    photo_url: string;
}

interface UploadFilesAreaProps {
    folder: string;
    id?: string;
    onUploadSuccess?: (photos: Photo[]) => void;
}

export default function UploadFilesArea({folder, onUploadSuccess}: UploadFilesAreaProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Обработка выбора файлов
    function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    }

    // Загрузка фотографий на сервер
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
                formData
            );

            const photos = response.data.photos;

            if (!Array.isArray(photos)) {
                setStatus("Ошибка: API вернул некорректный формат данных (ожидался массив photos)");
                return;
            }

            if (photos.length === 0) {
                setStatus("Фотографии не были загружены, API вернул пустой массив");
                return;
            }

            onUploadSuccess?.(photos);
            setFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Сброс поля ввода
            }
            setStatus("Файлы успешно загружены");
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || error.message || "Неизвестная ошибка";
                if (error.response?.data?.code === "NoSuchKey") {
                    setStatus("Ошибка: Файл не найден в S3. Проверьте конфигурацию хранилища.");
                } else {
                    setStatus(`Ошибка загрузки файла: ${errorMessage}`);
                }
            } else {
                setStatus("Неизвестная ошибка при загрузке файла");
            }
        }
    }

    return (
        <div>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesChange}
                ref={fileInputRef}
            />
            <button type="button" onClick={uploadPhotos}>
                Загрузить фото
            </button>
            <p>{status}</p>
        </div>
    );
}