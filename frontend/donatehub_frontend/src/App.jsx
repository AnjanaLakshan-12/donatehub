import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutUs from "./components/AboutUs";

import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseDonations from "./pages/BrowseDonations";
import BrowseDonationsByCategory from "./pages/BrowseDonationsByCategory";

import AdminDashboard from "./pages/admin/AdminDashboard";
import DonorDashboard from "./pages/donor/DonorDashboard";
import AddDonation from "./pages/donor/addDonation";
import UserProfile from "./pages/donor/UserProfile";
import OrganizationDashboard from "./pages/organization/OrganizationDashboard";
import OrganizationProfile from "./pages/organization/OrganizationProfile";

export default function App() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		try {
			const raw = localStorage.getItem("donateHubUser");
			if (raw) {
				setUser(JSON.parse(raw));
			}
		} catch (error) {
			console.error("Failed to parse stored user", error);
			localStorage.removeItem("donateHubUser");
		}
	}, []);

	return (
		<Router>
			<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
				<Navbar user={user} setUser={setUser} />
				<main style={{ flex: 1 }}>
					<Routes>
						<Route path="/" element={<Home user={user} />} />
						<Route path="/about" element={<AboutUs user={user} />} />
						<Route path="/contact" element={<ContactUs />} />
						<Route path="/login" element={<Login setUser={setUser} />} />
						<Route path="/register" element={<Register />} />
						<Route path="/browse-donations" element={<BrowseDonations user={user} />} />
						<Route
							path="/donations/category/:category"
							element={<BrowseDonationsByCategory user={user} />}
						/>

						<Route
							path="/admin"
							element={
								<ProtectedRoute user={user} role="ADMIN">
									<AdminDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/donor-dashboard"
							element={
								<ProtectedRoute user={user} role="DONOR">
									<DonorDashboard user={user} />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/donor/add-donation"
							element={
								<ProtectedRoute user={user} role="DONOR">
									<AddDonation user={user} />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/user-profile"
							element={
								<ProtectedRoute user={user}>
									<UserProfile user={user} />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/organization-dashboard"
							element={
								<ProtectedRoute user={user} role="ORG">
									<OrganizationDashboard user={user} />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/organization-profile"
							element={
								<ProtectedRoute user={user} role="ORG">
									<OrganizationProfile user={user} />
								</ProtectedRoute>
							}
						/>

						<Route path="*" element={<Home user={user} />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
}
