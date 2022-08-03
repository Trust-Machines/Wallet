import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Contact {
  name: string;
  address: string;
}

interface ContactsState {
  contactList: Contact[];
}

const initialState: ContactsState = {
  contactList: [],
};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addNewContact: (state, action: PayloadAction<Contact>) => {
      state.contactList = [...state.contactList, action.payload];
    },
    editContact: (state, action: PayloadAction<{ contact: Contact; index: number }>) => {
      let contacts = state.contactList;
      contacts[action.payload.index] = action.payload.contact;

      state.contactList = contacts;
    },
    deleteContactByIndex: (state, action: PayloadAction<number>) => {
      let contacts = state.contactList;
      contacts.splice(action.payload, 1);

      state.contactList = contacts;
    },
  },
});

export const { addNewContact, editContact, deleteContactByIndex } = contactsSlice.actions;

export default contactsSlice.reducer;
