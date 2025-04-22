import { FC, useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Event, CreateEventData } from '../../api/eventService';
import { CustomButton } from '../CustomButton/CustomButton';
import { ErrorNotification } from '../common/ErrorNotification/ErrorNotification';
import styles from './EventForm.module.scss';
import { uploadEventImage, deleteEventImage } from '../../features/events/eventsSlice';
import { useAppDispatch } from '../../app/hooks';

interface EventFormProps {
  event?: Event;
  onSubmit: (data: CreateEventData) => void;
  onCancel: () => void;
  error: string | null;
  loading: boolean;
}

const schema = yup.object().shape({
  title: yup
    .string()
    .required('Название обязательно')
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(100, 'Название не должно превышать 100 символов'),
  description: yup.string().max(1000, 'Описание не должно превышать 1000 символов'),
  date: yup
    .string()
    .required('Дата обязательна')
    .test('future-date', 'Дата не может быть в прошлом', function (value) {
      if (!value) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),
});

export const EventForm: FC<EventFormProps> = ({ event, onSubmit, onCancel, error, loading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateEventData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
    },
  });

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
      });
    }
  }, [event, reset]);

  useEffect(() => {
    if (event?.image_url) {
      setPreviewUrl(event.image_url);
    } else {
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setShouldDeleteImage(false);
  }, [event]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);
      setShouldDeleteImage(false);
    }
  };

  const handleDeleteImageClick = () => {
    if (selectedFile) {
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (event?.image_url) {
      setShouldDeleteImage(true);
      setPreviewUrl(null);
    }
  };

  const handleFormSubmit = async (data: CreateEventData) => {
    if (event?.id) {
      if (shouldDeleteImage) {
        await dispatch(deleteEventImage(event.id));
      } else if (selectedFile) {
        await dispatch(uploadEventImage({ eventId: event.id, file: selectedFile }));
      }
    }

    await onSubmit(data);
  };

  const handleCancelClick = () => {
    setSelectedFile(null);
    setShouldDeleteImage(false);
    if (event?.image_url) {
      setPreviewUrl(event.image_url);
    } else {
      setPreviewUrl(null);
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      {error && <ErrorNotification message={error} />}

      <div className={styles.formGroup}>
        <label htmlFor="title">Название</label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={errors.title ? styles.errorInput : ''}
        />
        {errors.title && <p className={styles.errorText}>{errors.title.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          {...register('description')}
          className={errors.description ? styles.errorInput : ''}
          rows={5}
        />
        {errors.description && <p className={styles.errorText}>{errors.description.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="date">Дата</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <input
              id="date"
              type="date"
              {...field}
              className={errors.date ? styles.errorInput : ''}
              min={new Date().toISOString().split('T')[0]}
            />
          )}
        />
        {errors.date && <p className={styles.errorText}>{errors.date.message}</p>}
      </div>

      {event && (
        <div className={styles.formGroup}>
          <label htmlFor="image">Изображение</label>
          <div className={styles.imageControls}>
            <input
              ref={fileInputRef}
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            {(previewUrl || shouldDeleteImage) && (
              <button
                type="button"
                onClick={handleDeleteImageClick}
                className={styles.deleteButton}
              >
                {selectedFile ? 'Отменить выбор' : 'Удалить изображение'}
              </button>
            )}
          </div>
          {!shouldDeleteImage && previewUrl && (
            <img src={previewUrl} alt="Изображение мероприятия" className={styles.previewImage} />
          )}
          {shouldDeleteImage && event.image_url && (
            <p className={styles.deleteNote}>Изображение будет удалено после сохранения</p>
          )}
        </div>
      )}

      <div className={styles.buttonGroup}>
        <CustomButton type="button" variant="secondary" onClick={handleCancelClick}>
          Отмена
        </CustomButton>
        <CustomButton type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : event ? 'Сохранить' : 'Создать'}
        </CustomButton>
      </div>
    </form>
  );
};
