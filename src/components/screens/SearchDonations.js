import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  getFirestore,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import "../screensCSS/SearchDonations.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../services/contexts/UserContext"; // נתיב נכון לקונטקסט
import { RxSwitch } from "react-icons/rx"; // יבוא של האייקון
import { useForm } from "react-hook-form";

function SearchDonations() {
  const { user: currentUser } = useUser(); // קבלת המשתמש הנוכחי מהקונטקסט
  const [associations, setAssociations] = useState([]);
  const [selectedAssoc, setSelectedAssoc] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newAssoc, setNewAssoc] = useState({
    IdAssociations: Date.now(),
    addressAssociations: "",
    district: "",
    donationRequest: [],
    information: "",
    nameAssociations: "",
    phoneAssociations: "",
    riting: "",
  });
  const [editingAssoc, setEditingAssoc] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log("useEffect called with currentUser:", currentUser);

    const checkAdmin = async () => {
      if (!currentUser) {
        console.log("No currentUser, returning");
        return;
      }
      console.log("Checking admin status for user:", currentUser);

      const db = getFirestore();
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("userName", "==", "admin"),
        where("fullName", "==", "admin")
      );

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const adminDoc = querySnapshot.docs[0];
          console.log("Admin document ID:", adminDoc.id);

          // Check if the current user's document ID matches the admin document ID
          if (adminDoc.id === currentUser.id) {
            console.log("Admin user found!");
            setIsAdmin(true);
          } else {
            console.log("Current user is not admin.");
          }
        } else {
          console.log("Admin user not found.");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdmin();

    const fetchAssociations = async () => {
      console.log("Fetching associations");
      const db = getFirestore();
      const assocsRef = collection(db, "Associations");

      try {
        const querySnapshot = await getDocs(assocsRef);
        const assocsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Associations fetched:", assocsArray);
        setAssociations(assocsArray);
      } catch (error) {
        console.error("Error fetching associations:", error);
      }
    };

    fetchAssociations();
  }, [currentUser]);

  const toggleOpen = (assoc) => {
    setSelectedAssoc(assoc !== selectedAssoc ? assoc : null);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssoc((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewAssoc((prev) => {
      const updatedDonationRequest = checked
        ? [...prev.donationRequest, name]
        : prev.donationRequest.filter((item) => item !== name);
      return {
        ...prev,
        donationRequest: updatedDonationRequest,
      };
    });
  };

  const handleAddOrganization = async (e) => {
    const db = getFirestore();
    try {
      await addDoc(collection(db, "Associations"), newAssoc);
      toast.success("Organization added successfully!");
      setNewAssoc({
        IdAssociations: Date.now(),
        addressAssociations: "",
        district: "",
        donationRequest: [],
        information: "",
        nameAssociations: "",
        phoneAssociations: "",
        riting: "",
      });
      setShowForm(false);
      setEditingAssoc(false);
      setEditingDocId(null);
      // Fetch updated list
      const querySnapshot = await getDocs(collection(db, "Associations"));
      const assocsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssociations(assocsArray);
    } catch (error) {
      console.error("Error adding organization:", error);
      toast.error("Failed to add organization.");
    }
  };

  const handleDeleteOrganization = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this organization?"
    );
    if (confirmDelete) {
      const db = getFirestore();
      try {
        await deleteDoc(doc(db, "Associations", id));
        toast.success("Organization deleted successfully!");
        setAssociations(associations.filter((assoc) => assoc.id !== id));
        setTimeout(() => {
          setSelectedAssoc(null);
        }, 1500);
      } catch (error) {
        console.error("Error deleting organization:", error);
        toast.error("Failed to delete organization.");
      }
    }
  };

  const handleEditOrganization = async (e) => {
    const db = getFirestore();
    try {
      const orgRef = doc(db, "Associations", editingDocId);
      await updateDoc(orgRef, newAssoc);
      toast.success("Organization updated successfully!");
      setNewAssoc({
        IdAssociations: Date.now(),
        addressAssociations: "",
        district: "",
        donationRequest: [],
        information: "",
        nameAssociations: "",
        phoneAssociations: "",
        riting: "",
      });
      setShowForm(false);
      setEditingAssoc(false);
      setEditingDocId(null);
      // Fetch updated list
      const querySnapshot = await getDocs(collection(db, "Associations"));
      const assocsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssociations(assocsArray);
      setTimeout(() => {
        setSelectedAssoc(null);
      }, 1500);
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Failed to update organization.");
    }
  };

  const handleEditButtonClick = (assoc) => {
    setNewAssoc(assoc);
    setShowForm(true);
    setEditingAssoc(true);
    setEditingDocId(assoc.id);
  };

  return (
    <div className="container">
      <ToastContainer />
      {selectedAssoc && (
        <div className="overlay" onClick={() => toggleOpen(selectedAssoc)}>
          <div
            className="org-details centered"
            onClick={(e) => e.stopPropagation()}
          >
            {isAdmin && editMode && (
              <div
                className="admin-buttons-wrapper"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteOrganization(selectedAssoc.id)}
                >
                  Delete Organization
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEditButtonClick(selectedAssoc)}
                >
                  Edit Organization
                </button>
              </div>
            )}
            <h1>{selectedAssoc.nameAssociations}</h1>
            <p>Information: {selectedAssoc.information}</p>
            <p>Donation Requests: {selectedAssoc.donationRequest.join(", ")}</p>
            <p>District: {selectedAssoc.district}</p>
            <p>Address: {selectedAssoc.addressAssociations}</p>
            <p>Phone: {selectedAssoc.phoneAssociations}</p>
            <p>Riting: {selectedAssoc.riting}</p>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="admin-controls">
          <button
            className={`edit-mode-btn ${editMode ? "active" : ""}`}
            onClick={toggleEditMode}
          >
            <RxSwitch />
          </button>
          {editMode && (
            <button
              className="add-org-btn"
              onClick={() => {
                setShowForm(true);
                setEditingAssoc(false);
                setNewAssoc({
                  IdAssociations: Date.now(),
                  addressAssociations: "",
                  district: "",
                  donationRequest: [],
                  information: "",
                  nameAssociations: "",
                  phoneAssociations: "",
                  riting: "",
                });
              }}
            >
              Add New Organization
            </button>
          )}
        </div>
      )}
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <form
              onSubmit={handleSubmit(
                editingAssoc ? handleEditOrganization : handleAddOrganization
              )}
            >
              <h2>
                {editingAssoc ? "Edit Organization" : "Add New Organization"}
              </h2>
              <input
                {...register("nameAssociations", {
                  required: true,
                  pattern: /^[a-zA-Z\s]*$/,
                })}
                type="text"
                name="nameAssociations"
                value={newAssoc.nameAssociations}
                onChange={handleInputChange}
                placeholder="Organization Name"
                required
              />
              {errors.nameAssociations && (
                <div className="error-message">
                  * Organization name must contain only letters and spaces.
                </div>
              )}

              <input
                {...register("phoneAssociations", {
                  required: true,
                  pattern: /^[0-9]{10}$/,
                })}
                type="text"
                name="phoneAssociations"
                value={newAssoc.phoneAssociations}
                onChange={handleInputChange}
                placeholder="Phone"
                required
              />
              {errors.phoneAssociations && (
                <div className="error-message">
                  * Phone number must be exactly 10 digits.
                </div>
              )}

              <input
                {...register("riting", {
                  required: true,
                  pattern: /^(?:[1-9][0-9]?|100)$/,
                })}
                type="text"
                name="riting"
                value={newAssoc.riting}
                onChange={handleInputChange}
                placeholder="Riting"
                required
              />
              {errors.riting && (
                <div className="error-message">
                  * Rating must be a number between 0 and 100.
                </div>
              )}

              <select
                name="district"
                value={newAssoc.district}
                onChange={handleInputChange}
                required
              >
                <option value="">Select District</option>
                <option value="Center District">Center District</option>
                <option value="North District">North District</option>
                <option value="South District">South District</option>
                <option value="Jerusalem District">Jerusalem District</option>
                <option value="Eilat District">Eilat District</option>
              </select>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="food"
                    checked={newAssoc.donationRequest.includes("food")}
                    onChange={handleCheckboxChange}
                  />
                  Food
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="moving"
                    checked={newAssoc.donationRequest.includes("moving")}
                    onChange={handleCheckboxChange}
                  />
                  Moving
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="financialContribution"
                    checked={newAssoc.donationRequest.includes(
                      "financialContribution"
                    )}
                    onChange={handleCheckboxChange}
                  />
                  Financial Contribution
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Equipment"
                    checked={newAssoc.donationRequest.includes("Equipment")}
                    onChange={handleCheckboxChange}
                  />
                  Equipment
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Trump"
                    checked={newAssoc.donationRequest.includes("Trump")}
                    onChange={handleCheckboxChange}
                  />
                  Trump
                </label>
                {newAssoc.donationRequest.length === 0 && (
                  <div className="error-message">
                    * At least one service must be selected.
                  </div>
                )}
              </div>

              <textarea
                name="information"
                value={newAssoc.information}
                onChange={handleInputChange}
                placeholder="Information"
                required
              />

              <button type="submit">
                {editingAssoc ? "Update Organization" : "Add Organization"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className={`org-list ${showForm ? "blurred" : ""}`}>
        {associations.map((assoc) => (
          <div
            key={assoc.id}
            className="org-entry"
            onClick={() => toggleOpen(assoc)}
          >
            <h1>{assoc.nameAssociations}</h1>
            <p>District: {assoc.district}</p>
            <p>Donation Requests: {assoc.donationRequest.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchDonations;
