// All reducer action types for editing or adding transactions
export const ACTIONS = {
    START_EDIT: "START_EDIT",
    CANCEL_EDIT: "CANCEL_EDIT",
    SHOW_ADD_FORM: "SHOW_ADD_FORM",
    HIDE_ADD_FORM: "HIDE_ADD_FORM",
};

// Initial UI state for editing and adding transactions
export const initialState = {
    isEditing: false,
    editMonth: "",
    editPoints: 0,
    showAddForm: false,
};

// Reducer controlling edit/add transaction UI states
export function customerCardReducer(state, action) {
    switch (action.type) {
        case ACTIONS.START_EDIT:
            return {
                ...state,
                isEditing: true,
                editMonth: action.payload.month.trim(), // correct month
                editPoints: action.payload.points,
            };

        case ACTIONS.CANCEL_EDIT:
            // Exit edit mode and reset edit fields
            return {
                ...state,
                isEditing: false,
                editMonth: "",
                editPoints: 0,
            };

        case ACTIONS.SHOW_ADD_FORM:
            // Show form for adding a new transaction
            return {
                ...state,
                showAddForm: true,
            };

        case ACTIONS.HIDE_ADD_FORM:
            // Hide add-transaction form
            return {
                ...state,
                showAddForm: false,
            };

        default:
            return state; // Default fallback
    }
}
