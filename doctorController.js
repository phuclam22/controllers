import {
    getDocs, onSnapshot, where, setDoc, getDoc, addDoc, updateDoc, query, update
  } 
from 'firebase/firestore';
import {db} from '../startApp.js'
import {
      collection, doc
    } 
from 'firebase/firestore';

  
class doctorController {
    constructor() {}
    
    async getPatient() {
        console.log("Getting patient");
        const allUsers = [];
        try {
                const subcolref = collection(db, 'Users', 'Patient', 'Data');
                const subsnapshot = await getDocs(subcolref);
                subsnapshot.forEach((doc) => {
                    allUsers.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                })
            } 
        catch (error) {
            console.error("Error fetching data:", error);
            }
        return allUsers;
      }


    getMedicine = async () => {
        const medicines = [];
        try {
            const medicineCollection = collection(db, 'Hospital', 'Medicine', 'Data');
            const subsnapshot = await getDocs(medicineCollection);
            subsnapshot.forEach((doc) => {
                medicines.push({
                    ...doc.data(),
                    });
            });
        } 
        catch (error) {
            console.error("Error fetching medicine data:", error);
        }
        return medicines;
    }
 



//////////////// Chưa xong
    decreaseQuantityMedicine = async (medicineName, quantityToDecrease) => {
        try {
            const medicines = await this.getMedicine(); 
            const foundMedicine = medicines.find(medicine => medicine.Name === medicineName); 
            if (foundMedicine && foundMedicine.Name) {
                const currentQuantity = foundMedicine.Quantity;
    
                if (currentQuantity >= quantityToDecrease) {
                    const newQuantity = currentQuantity - quantityToDecrease;
                    const medicineRef = doc(collection(db, 'Hospital', 'Medicine', 'Data'), foundMedicine.Name);
                    
                    await setDoc(medicineRef, { Quantity: newQuantity }, { merge: true });
                    
                    console.log(`Decreased quantity of medicine ${medicineName} successfully.`);
                    return newQuantity;
                } else {
                    console.error("Not enough quantity available to decrease.");
                }
            } else {
                console.error("Medicine with name ", medicineName, " not found.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    


////////////// Chưa xong
    addDiagnosis = async (ID_Patient, Diagnosis) => {
        try {
            const patientRef = doc(collection(db, 'Users', 'Patient', 'Data'), ID_Patient);
            const patientDoc = await getDoc(patientRef);
    
            if (patientDoc.exists()) {
                const MedExamSchRef = collection(db, 'MedExamSch');
                await setDoc(MedExamSchRef, {
                    ID_Patient: ID_Patient,
                    Diagnosis: Diagnosis
                });
    
                console.log("Diagnosis added successfully for patient with ID: ", ID_Patient);
                return true; 
            } else {
                console.error("Patient with ID ", ID_Patient, "not found.");
                return false; 
            }
        } 
        catch (error) {
            console.error("Error:", error);
            throw error; 
        }
    };
    
    


    viewMyPatientMedExamSch = async (id) => {
        try {
            const medExamSchCollectionRef = collection(db, 'MedExamSch');
            const patientMedExamQuery = query(medExamSchCollectionRef, where("ID_Patient", "==", id));
            const querySnapshot = await getDocs(patientMedExamQuery);
            const medicalHistory = [];
            querySnapshot.forEach((doc) => {
                medicalHistory.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return medicalHistory;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };
    





////////////// Chưa xong
    addPrescription = async (ID_Patient, Dosage, Duration, MedicineName, Quantity) => {
        try {
            const medExamSchCollectionRef = collection(db, 'MedExamSch');
            const querySnapshot = await getDocs(query(medExamSchCollectionRef, where('ID_Patient', '==', ID_Patient)));
            
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const medExamSchRef = doc.ref;
                    medExamSchRef.updateDoc({
                        Dosage: Dosage,
                        Duration: Duration,
                        MedicineName: MedicineName,
                        Quantity: Quantity
                    });
                });
                console.log("Prescription updated successfully.");
            } else {
                await addDoc(medExamSchCollectionRef, {
                    ID_Patient: ID_Patient,
                    Dosage: Dosage,
                    Duration: Duration,
                    MedicineName: MedicineName,
                    Quantity: Quantity
                });
                console.log("New prescription added successfully.");
            }
        } catch (error) {
            console.error("Error adding or updating prescription:", error);
            throw error;
        }
    };
    
    
    viewDevices = async () => {
        try {
            const devicesCollectionRef = collection(db, 'Hospital', 'Devices', 'Data');
            const querySnapshot = await getDocs(devicesCollectionRef);
            const devices = [];
            querySnapshot.forEach((doc) => {
                devices.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
                return devices;
        } 
        catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };
    


    viewOnCallSchedule = async (ID_Doctor) => {
        try {
            const onCallScheduleCollectionRef = collection(db, 'Hospital', 'On-call schedule', 'Data');
            const querySnapshot = await getDocs(onCallScheduleCollectionRef);
            const scheduleDates = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.DoctorList && data.DoctorList.includes(ID_Doctor)) {
                    scheduleDates.push(data.Date.toDate());
                }
            });
            return scheduleDates;
        } catch (error) {
            console.error("Error fetching on-call schedule:", error);
            throw error;
        }
    };
    
  }
   
export {doctorController};