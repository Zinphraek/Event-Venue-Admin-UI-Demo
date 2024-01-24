import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResponsiveAppBar from "../components/header/ResponsiveAppBar";
import Account from "../components/header/Account";
import AddOns from "../components/addons/AddOns";
import Appointments from "../components/appointments/Appointments";
import Dashboard from "../components/dashboard/Dashboard";
import Profile from "../components/header/Profile";
import Reservations from "../components/reservations/Reservations";
import Users from "../components/users/Users";
import PagesEndPoint from "../utils/constants/PagesEndPoint";
import { AddOnsProvider } from "../components/provider/AddOnsProvider";
import { UserProvider } from "../components/provider/UserProvider";
import Events from "../components/events/Events";
import Invoices from "../components/invoices/Invoices";
import Receipts from "../components/receipts/Receipts";
import FAQs from "../components/FAQS/FAQs";
import KeycloakService from "../components/config/KeycloakService";
import NotAdminWarning from "./NotAdminWarning";

const App = () => {
  return (
    <>
      {!KeycloakService.hasRole(["admin"]) ? (
        <NotAdminWarning />
      ) : (
        <UserProvider>
          <AddOnsProvider>
            <Router>
              <ResponsiveAppBar />
              <Routes>
                <Route
                  path={PagesEndPoint.DASHBOARD_PAGE_URL}
                  element={<Dashboard />}
                />
                <Route
                  path={PagesEndPoint.ACCOUNT_PAGE_URL}
                  element={<Account />}
                />
                <Route
                  path={PagesEndPoint.PROFILE_PAGE_URL}
                  element={<Profile />}
                />
                <Route
                  path={PagesEndPoint.EVENT_PAGE_URL}
                  element={<Events />}
                />
                <Route
                  path={PagesEndPoint.ADDONS_PAGE_URL}
                  element={<AddOns />}
                />
                <Route
                  path={PagesEndPoint.INVOICES_PAGE_URL}
                  element={<Invoices />}
                />
                <Route
                  path={PagesEndPoint.RECEIPTS_PAGE_URL}
                  element={<Receipts />}
                />
                <Route
                  path={PagesEndPoint.APPOINTMENTS_PAGE_URL}
                  element={<Appointments />}
                />
                <Route
                  path={PagesEndPoint.RESERVATIONS_PAGE_URL}
                  element={<Reservations />}
                />
                <Route
                  path={PagesEndPoint.USERS_PAGE_URL}
                  element={<Users />}
                />
                <Route
                  path={PagesEndPoint.RECEIPTS_PAGE_URL}
                  element={<Receipts />}
                />
                <Route path={PagesEndPoint.FAQS_PAGE_URL} element={<FAQs />} />
              </Routes>
            </Router>
          </AddOnsProvider>
        </UserProvider>
      )}
    </>
  );
};

export default App;
