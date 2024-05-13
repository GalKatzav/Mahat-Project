import React, { useState, useEffect } from "react";
import { getDocs, collection, getFirestore } from "firebase/firestore";
import "../screensCSS/SearchDonations.css";

function SearchDonations() {
    const [associations, setAssociations] = useState([]);
    const [selectedAssoc, setSelectedAssoc] = useState(null);

    useEffect(() => {
        const db = getFirestore();
        const assocsRef = collection(db, "Associations");

        const fetchAssociations = async () => {
            try {
                const querySnapshot = await getDocs(assocsRef);
                const assocsArray = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAssociations(assocsArray);
            } catch (error) {
                console.error("Error fetching associations:", error);
            }
        };

        fetchAssociations();
    }, []);

    const toggleOpen = (assoc) => {
        setSelectedAssoc(assoc !== selectedAssoc ? assoc : null);
    };

    return (
        <div className="container">
            {selectedAssoc ? (
                <div className="org-details centered" onClick={() => toggleOpen(selectedAssoc)}>
                    <h1>{selectedAssoc.nameAssociations}</h1>
                    <p>Information: {selectedAssoc.information}</p>
                    <p>Donation Requests: {selectedAssoc.donationRequest.join(', ')}</p>
                    <p>District: {selectedAssoc.district}</p>
                    <p>Address: {selectedAssoc.addressAssociations}</p>
                    <p>Phone: {selectedAssoc.phoneAssociations}</p>
                </div>
            ) : (
                <div className="org-list">
                    {associations.map(assoc => (
                        <div key={assoc.id} className="org-entry" onClick={() => toggleOpen(assoc)}>
                            <h1>{assoc.nameAssociations}</h1>
                            <p>District: {assoc.district}</p>
                            <p>Donation Requests: {assoc.donationRequest.join(', ')}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchDonations;
