import {

    getDocs, onSnapshot,collection,
    doc, getDoc, query,where,
    addDoc,
  
} from 'firebase/firestore';
import {db} from '../startApp.js'
class patientController {
    async viewDoctors() {
        
        const allUsers = [];
        try {
            const subcolref = collection(db, 'Users', 'Doctor', 'Data');
            
            const subsnapshot = await getDocs(subcolref);
            subsnapshot.forEach((doc) => {
                allUsers.push({
                    id: doc.id,
                   ...doc.data(),
                });
            })
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle errors appropriately (consider rejecting the Promise)
        }
        
        return allUsers;
    }
    async addMedExamSch(DescSymptoms,Diagnosis,ID_Doctor,ID, Email, FName, LName,Gen,Phone,dateOfBirth) {
        const MedExamSch = collection(db, 'MedExamSch');
        const PatientList = collection(db,'Users','Patient','Data');
        const PatientID = query(PatientList, where("IDCard","==",ID));
        let Users = []
        const PatientMem = await getDocs(PatientID) 
        PatientMem.forEach((doc) => {
            Users.push({
                id: doc.id,
               ...doc.data(),
            });
        })
        console.log(Users);
        if (Users.length == 0) {
            console.log("No users");
            addDoc(PatientList, {
                IDCard: ID,
                Email: Email,
                FirstName: FName,
                LastName: LName,
                Gender: Gen,
                Phone: Phone,
                
                
            })
            .then (() => {
                 console.log("Thêm thành công");
                
            })
            .catch((error) => {
                console.error("Error adding document:", error);
                // Handle errors appropriately (consider rejecting the Promise)
            })
        }
        else {
            addDoc(MedExamSch, {
                DescSymptoms: DescSymptoms,
                Diagnosis: Diagnosis,
                ID_Doctor: ID_Doctor,
                ID_Patient: Users[0].id,
            })
            .then (() => {
                 console.log("Thêm thành công");
                
            })
            .catch((error) => {
                 console.error("Error adding document:", error);
                 // Handle errors appropriately (consider rejecting the Promise)
             })
        }
    }

}

export {patientController}