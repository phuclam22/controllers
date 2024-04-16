import {
    getDocs, onSnapshot,collection, doc, addDoc, query, where, deleteDoc, updateDoc, increment
  
} 
from 'firebase/firestore';
import {db} from '../startApp.js'

class managerController {
    async getManager() {
        try {
            const managerCollection = collection(db, 'Users', 'Manager', 'Data');
            const querySnapshot = await getDocs(managerCollection);
            const managers = [];
            querySnapshot.forEach((doc) => {
                managers.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return managers;
        } catch (error) {
            console.error('Error fetching managers:', error);
            throw error;
        }
    };
    
   async getDoctors() {
        const allDoctors = [];
        try {
                const subcolref = collection(db, 'Users', 'Doctor', 'Data');
                const subsnapshot = await getDocs(subcolref);
                subsnapshot.forEach((doc) => {
                    allDoctors.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                })
            } 
        catch (error) {
            console.error("Error fetching data:", error);
            }
        return allDoctors;
      }

    async addDoctor(DateOfBirth, Department, Email, FirstName, Gender, IDCard, LastName, Phone) {
        try {
            const doctorCollection = collection(db, 'Users', 'Doctor', 'Data');
            await addDoc(doctorCollection, {
                DateOfBirth: DateOfBirth,
                Department: Department,
                Email: Email,
                FirstName: FirstName,
                Gender: Gender,
                IDCard: IDCard,
                LastName: LastName,
                Phone: Phone
            });
            console.log('Doctor added successfully.');
        } catch (error) {
            console.error('Error adding doctor:', error);
            throw error;
        }
    }
   
    
    async deleteDoctor(ID) {
        try {
            const doctorQuery = query(collection(db, 'Users', 'Doctor', 'Data'), where('IDCard', '==', ID));
            const doctorQuerySnapshot = await getDocs(doctorQuery);
            doctorQuerySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log('Doctor deleted successfully.');
            });
        } catch (error) {
            console.error('Error deleting doctor:', error);
            throw error;
        }
    }

  
    async updateDoctor(DateOfBirth, Department, Email, FirstName, Gender, IDCard, LastName, Phone) {
        try {
            const doctorCollection = collection(db, 'Users', 'Doctor', 'Data');
            const querySnapshot = await getDocs(query(doctorCollection, where('IDCard', '==', IDCard)));
            
            if (querySnapshot.empty) {
                console.log('No doctor found with IDCard:', IDCard);
                return;
            }
            
            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    DateOfBirth: DateOfBirth,
                    Department: Department,
                    Email: Email,
                    FirstName: FirstName,
                    Gender: Gender,
                    LastName: LastName,
                    Phone: Phone
                });
                console.log('Doctor updated successfully:', doc.id);
            });
        } catch (error) {
            console.error('Error updating doctor:', error);
            throw error;
        }
    }
    

    async addPatient(DateOfBirth, Email, FirstName, Gender, IDCard, LastName, Phone) {
        try {
            const patientCollection = collection(db, 'Users', 'Patient', 'Data');

            await addDoc(patientCollection, {
                DateOfBirth: DateOfBirth,
                Email: Email,
                FirstName: FirstName,
                Gender: Gender,
                IDCard: IDCard,
                LastName: LastName,
                Phone: Phone
            });

            console.log('Patient added successfully');
        } catch (error) {
            console.error('Error adding patient:', error);
            throw error;
        }
    }

    async deletePatient(ID) {
        try {
            const patientQuery = query(collection(db, 'Users', 'Patient', 'Data'), where('IDCard', '==', ID));
            const patientQuerySnapshot = await getDocs(patientQuery);
            patientQuerySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log('Patient deleted successfully.');
            });
        } catch (error) {
            console.error('Error deleting Patient:', error);
            throw error;
        }
    }

    async updatePatient(DateOfBirth, Email, FirstName, Gender, IDCard, LastName, Phone) {
        try {
            const patientCollection = collection(db, 'Users', 'Patient', 'Data');
            const querySnapshot = await getDocs(query(patientCollection, where('IDCard', '==', IDCard)));

            if (querySnapshot.empty) {
                console.log('No patient found with IDCard:', IDCard);
                return;
            }

            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    DateOfBirth: DateOfBirth,
                    Email: Email,
                    FirstName: FirstName,
                    Gender: Gender,
                    LastName: LastName,
                    Phone: Phone
                });

                console.log('Patient updated successfully:', doc.id);
            });
        } catch (error) {
            console.error('Error updating patient:', error);
            throw error;
        }
    }

    //Orther
    addIDDoctorToMedExamSch = (idDoctor) => {};
    
    async addOnCallSchedule(Date, ID) {
        try {
            const onCallScheduleCollection = collection(db, 'Hospital', 'On-call schedule', 'Data');
            const querySnapshot = await getDocs(query(onCallScheduleCollection, where('Date', '==', Date)));

            if (!querySnapshot.empty) {
                const onCallScheduleDoc = querySnapshot.docs[0]; 
                const doctorList = onCallScheduleDoc.data().DoctorList || []; 
                doctorList.push(ID);
                await updateDoc(onCallScheduleDoc.ref, { DoctorList: doctorList });
                console.log('Added doctor with ID', ID, 'to existing on-call schedule for date:', Date);
            } else {
                const newOnCallSchedule = await addDoc(onCallScheduleCollection, {
                    Date: Date,
                    DoctorList: [ID]
                });

                console.log('Created new on-call schedule for date:', Date, 'with doctor ID:', ID);
            }
        } catch (error) {
            console.error('Error adding on-call schedule:', error);
            throw error;
        }
    }


    async addDevice(Availability, MFG, Name, Quantity, Status) {
        try {
            const deviceCollection = collection(db, 'Hospital','Devices', 'Data');
            await addDoc(deviceCollection, {
                Availability: Availability,
                MFG: MFG,
                Name: Name,
                Quantity: Quantity,
                Status: Status
            });
            console.log('Device added successfully.');
        } catch (error) {
            console.error('Error adding device:', error);
            throw error;
        }
    };
    

    async deleteDevice(deviceName) {
        try {
            const deviceQuery = query(collection(db, 'Hospital', 'Devices', 'Data'), where('Name', '==', deviceName));
            const deviceQuerySnapshot = await getDocs(deviceQuery);
            deviceQuerySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log('Device deleted successfully.');
            });
        } catch (error) {
            console.error('Error deleting device:', error);
            throw error;
        }
    }
    async updateDevice(Availability, MFG, Name, Quantity, Status) {
        try {
            const deviceQuery = query(collection(db, 'Hospital', 'Devices', 'Data'), where('Name', '==', Name));
            const deviceQuerySnapshot = await getDocs(deviceQuery);
            deviceQuerySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    Availability: Availability,
                    MFG: MFG,
                    Quantity: Quantity,
                    Status: Status
                });
                console.log('Device updated successfully.');
            });
        } catch (error) {
            console.error('Error updating device:', error);
            throw error;
        }
    }


    async addMedicine(EXP, MFG, Name, Price, Quantity, Strength) {
        try {
            const medicineCollection = collection(db, 'Hospital', 'Medicine', 'Data');
            await addDoc(medicineCollection, {
                EXP: EXP,
                MFG: MFG,
                Name: Name,
                Price: Price,
                Quantity: Quantity,
                Strength: Strength
            });
            console.log('Medicine added successfully.');
        } catch (error) {
            console.error('Error adding medicine:', error);
            throw error;
        }
    }
    
    async deleteMedicine(Name) {
        try {
            const medicineCollection = collection(db, 'Hospital', 'Medicine', 'Data');
            const q = query(medicineCollection, where("Name", "==", Name));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log('Medicine deleted successfully.');
            });
        } catch (error) {
            console.error('Error deleting medicine:', error);
            throw error;
        }
    }

    async updateMedicine(EXP, MFG, Name, Price, Quantity, Strength) {
        try {
            const medicineCollection = collection(db, 'Hospital', 'Medicine', 'Data');
            const q = query(medicineCollection, where("Name", "==", Name));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    EXP: EXP,
                    MFG: MFG,
                    Price: Price,
                    Quantity: Quantity,
                    Strength: Strength
                });
                console.log('Medicine updated successfully.');
            });
        } catch (error) {
            console.error('Error updating medicine:', error);
            throw error;
        }
    }

    async increaseQuantity(Name, addQuantity) {
        try {
            const medicineCollection = collection(db, 'Hospital', 'Medicine', 'Data');
            const q = query(medicineCollection, where("Name", "==", Name));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                const currentQuantity = doc.data().Quantity;
                const newQuantity = currentQuantity + addQuantity;
                await updateDoc(doc.ref, {
                    Quantity: increment(addQuantity)
                });
                console.log(`Quantity of medicine "${Name}" increased by ${addQuantity}.`);
            });
        } catch (error) {
            console.error('Error increasing quantity:', error);
            throw error;
        }
    }
}
export {managerController};