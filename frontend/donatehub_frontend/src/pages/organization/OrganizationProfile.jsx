import { useEffect, useState } from "react";
import { getUserById } from "../../services/userService";

export default function OrganizationProfile({ user }) {
  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await getUserById(user.id);
        console.log("Organization data received:", res.data);
        setProfileData(res.data);
      } catch (err) {
        console.error("Error fetching organization data:", err);
        // Fallback to the user prop if fetch fails
        setProfileData(user);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user?.id]);

  if (!profileData) {
    return <div>No organization information available</div>;
  }

  const orgData = profileData;

  return (
    <div>
      <div>
        <h2>Organization Profile</h2>
        {loading && <p>Loading...</p>}
        
        <div>
          <span>Organization Name:</span>
          <span>{orgData.organizationName || orgData.organization_name || orgData.orgName || "N/A"}</span>
        </div>

        <div>
          <span>Contact Person:</span>
          <span>{orgData.firstName || orgData.first_name || "N/A"}</span>
        </div>

        <div>
          <span>Last Name:</span>
          <span>{orgData.lastName || orgData.last_name || orgData.lname || orgData.surname || "N/A"}</span>
        </div>

        <div>
          <span>Email:</span>
          <span>{orgData.email || "N/A"}</span>
        </div>

        <div>
          <span>Phone:</span>
          <span>{orgData.phone || orgData.phoneNumber || "N/A"}</span>
        </div>

        <div>
          <span>District:</span>
          <span>{orgData.district || orgData.location || orgData.address || "N/A"}</span>
        </div>

        <div>
          <span>Website:</span>
          <span>{orgData.website || orgData.websiteUrl || "N/A"}</span>
        </div>

        <div>
          <span>Description:</span>
          <span>{orgData.description || orgData.bio || "N/A"}</span>
        </div>

        <div>
          <span>Role:</span>
          <span>
            {orgData.role === "ORG" || orgData.role === "ORGANIZATION" ? "Organization" : "Other"}
          </span>
        </div>
      </div>
    </div>
  );
}

