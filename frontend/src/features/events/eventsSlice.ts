import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Event, eventService, CreateEventData } from '../../api/eventService';
import { TokenStorage } from '../../utils/tokenStorage';

interface EventsState {
  items: Event[];
  loading: boolean;
  error: string | null;
  selectedEvent: Event | null;
}

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,
  selectedEvent: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const events = await eventService.getUserEvents();
      return events;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось загрузить мероприятия'
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (data: CreateEventData, { rejectWithValue }) => {
    try {
      const event = await eventService.createEvent(data);
      return event;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось создать мероприятие'
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async (data: Event, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = data;
      const event = await eventService.updateEvent(id, updateData);
      return event;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось обновить мероприятие'
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: number, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось удалить мероприятие'
      );
    }
  }
);

export const uploadEventImage = createAsyncThunk(
  'events/uploadImage',
  async ({ eventId, file }: { eventId: number; file: File }, { rejectWithValue }) => {
    try {
      const event = await eventService.uploadEventImage(eventId, file);
      return event;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось загрузить изображение'
      );
    }
  }
);

export const deleteEventImage = createAsyncThunk(
  'events/deleteImage',
  async (eventId: number, { rejectWithValue }) => {
    try {
      const event = await eventService.deleteEventImage(eventId);
      return event;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось удалить изображение'
      );
    }
  }
);

export const getUserEvents = createAsyncThunk(
  'events/getUserEvents',
  async ({ userId }: { userId?: number }, { rejectWithValue }) => {
    try {
      const tokens = TokenStorage.getTokens();
      if (!tokens) {
        throw new Error('Не найден токен авторизации');
      }

      const response = await eventService.getUserEvents(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEvents: state => {
      state.items = [];
    },
    clearError: state => {
      state.error = null;
    },
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.items.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEvent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.items.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEvent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(event => event.id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadEventImage.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadEventImage.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.items.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(uploadEventImage.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEventImage.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.items.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(getUserEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getUserEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEvents, clearError, setSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
