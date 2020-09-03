import { HeaderState } from 'app/containers/Header/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  header?: HeaderState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
