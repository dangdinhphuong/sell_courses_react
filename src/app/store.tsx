// import productApi, { productReducer } from "@/api/product";
import categoryApi, { categoryReducer } from "@/Api/categoryApi";
import productApi, { productReducer } from "@/Api/productApi";
import userApi, { UserReducer } from "@/Api/userApi";
import BlogApi, { BlogReducer } from "@/Api/Blog";
("@/Api/Blog");
import paymentApi, { paymentReducer } from "@/Api/payment";
import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import ratingApi, { ratingReducer } from "@/Api/ratingApi";
import lessonApi, { lessonReducer } from "@/Api/lesson";
import quizzApi, { quizzReducer } from "@/Api/quizz";
import commentApi, { commentReducer } from "@/Api/CommentApi";
import noteApi, { noteReducer } from "@/Api/note";
import courseprogressApi, { courseprogressReducer } from "@/Api/CourseProgress";
import ScoreApi, { ScoreReducer } from "@/Api/score";
import orderApi, { orderReducer } from "@/Api/order";
import comment2Api, { comment2Reducer } from "@/Api/comment";
import getOderMoneyApi, { getOderMoneyReducer } from "@/Api/getOrderMany";
import HistoryTestApi, { HistoryReducer } from "@/Api/historyTest"
// Cấu hình persist ( lưu localStorage )
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"],
};
const rootReducer = combineReducers({
  [productApi.reducerPath]: productReducer,
  [categoryApi.reducerPath]: categoryReducer,
  [userApi.reducerPath]: UserReducer,
  [BlogApi.reducerPath]: BlogReducer,
  [paymentApi.reducerPath]: paymentReducer,
  [ratingApi.reducerPath]: ratingReducer,
  [commentApi.reducerPath]: commentReducer,
  [lessonApi.reducerPath]: lessonReducer,
  [quizzApi.reducerPath]: quizzReducer,
  [noteApi.reducerPath]: noteReducer,
  [courseprogressApi.reducerPath]: courseprogressReducer,
  [ScoreApi.reducerPath]: ScoreReducer,
  [orderApi.reducerPath]: orderReducer,
  [comment2Api.reducerPath]: comment2Reducer,
  [getOderMoneyApi.reducerPath]: getOderMoneyReducer,
  [HistoryTestApi.reducerPath]: HistoryReducer,

});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(productApi.middleware)
      .concat(categoryApi.middleware)
      .concat(userApi.middleware)
      .concat(BlogApi.middleware)
      .concat(paymentApi.middleware)
      .concat(ratingApi.middleware)
      .concat(lessonApi.middleware)
      .concat(quizzApi.middleware)
      .concat(noteApi.middleware)
      .concat(courseprogressApi.middleware)
      .concat(ScoreApi.middleware)
      .concat(orderApi.middleware)
      .concat(commentApi.middleware)
      .concat(comment2Api.middleware)
      .concat(getOderMoneyApi.middleware)
      .concat(HistoryTestApi.middleware),
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default persistStore(store);
