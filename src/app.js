// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RewardsManagement from "./pages/RewardsManagement";
import TransactionManagement from "./pages/TransactionManagement";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";

/**
 * Main App component that sets up routing for the application.
 * @returns {JSX.Element} The routed application.
 */
function App() {
    return (
        <Router>
            <Routes>
                {/* Commented out: Dashboard route for future use */}
                {/* <Route
                    path="/"
                    element={<Dashboard customers={customers} setCustomers={setCustomers} />}
                /> */}
                {/* Default route to Transaction Management */}
                <Route
                    path="/"
                    element={<TransactionManagement />}
                />
                {/* Route for managing rewards */}
                <Route
                    path="/manage-rewards"
                    element={<RewardsManagement />}
                />
                {/* Alternative route for transaction management */}
                <Route
                    path="/transaction-management"
                    element={<TransactionManagement />}
                />
            </Routes>
        </Router>
    );
}

export default App;
