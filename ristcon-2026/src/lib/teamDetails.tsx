// src/data/teamDetails.ts

export type Member = {
  name: string;
  department: string;
};

export type ContactPerson = {
  position: string;
  name: string;
  department: string;
  mobile?: string;
  phone?: string;
  email?: string;
};

export const teamDetails: { [category: string]: Member[] | ContactPerson[] } = {
  "Advisory Board": [
    { name: "Senior Prof. L.A.L.W. Jayasekara", department: "Department of Mathematics, Faculty of Science, University of Ruhuna" },
    { name: "Senior Prof. (Mrs.) P.D. Abeysinghe", department: "Department of Botany, Faculty of Science, University of Ruhuna" },
    { name: "Senior Prof. (Mrs.) V. P. Bulugahapitiya", department: "Department of Chemistry, Faculty of Science, University of Ruhuna" },
    { name: "Prof. Archana Sharma", department: "Senior Scientist, CERN, Geneva, Switzerland" },
    { name: "Prof. Ajith Karunaratne", department: "Department of Chemistry, Saint Louis University, USA" },
  ],

  "Editorial Board": [
    { name: "Senior. Prof. L. A. L. W. Jayasekara (Statistics)", department: "Department of Mathematics, Faculty of Science, University of Ruhuna" },
    { name: "Prof. B.G. Sampath A. Pradeep (Applied Mathematics)", department: "Department of Mathematics, Faculty of Science, University of Ruhuna" },
    { name: "Senior. Prof.(Mrs) K.B.S. Gunawickrama", department: "Department of Zoology, Faculty of Science, University of Ruhuna" },
    { name: "Prof. G.D.K. Mahanama", department: "Department of Physics, Faculty of Science, University of Ruhuna" },
    { name: "Prof. S. Wanniarachchi", department: "Department of Chemistry, Faculty of Science, University of Ruhuna" },
    { name: "Prof. K. Masakorala", department: "Department of Botany, Faculty of Science, University of Ruhuna" },
    { name: "Prof.(Mrs) W.A. Indika", department: "Department of Computer Science, Faculty of Science, University of Ruhuna" },
  ],

  "Committee Members": [
    { name: "Chairperson - Dr. Y.M.A.L.W. Yapa", department: "Department of Chemistry" },
    { name: "Joint Secretary - Dr. K. D. Prasangika", department: "Department of Mathematics" },
    { name: "Joint Secretary - Dr. H. A. D. S. D. Perera", department: "Department of Physics" },
    { name: "Mr.D. D. N. Sripal", department: "Department of Botany" },
    { name: "Dr. H. D. Jayasekara", department: "Department of Chemistry" },
    { name: "Ms. Binuri Raigamkorale", department: "Department of Computer Science" },
    { name: "Mr. L. T. Wedage", department: "Department of Mathematics" },
    { name: "Ms. K. M. Liyanage", department: "Department of Physics" },
    { name: "Dr. W. G. D. Chathuranga", department: "Department of Zoology" },
    { name: "Mr. L. L. Gihan Chathuranga", department: "Department of Computer Science" },
    { name: "Mrs. Lakshika Jayarathna", department: "Dean's office" },
  ],

  "Contact People": [
    {
      position: "Chairperson / RISTCON 2026",
      name: "Dr. Y.M.A.L.W. Yapa",
      department: "Department of Chemistry, Faculty of Science, University of Ruhuna, Matara, Sri Lanka.",
      mobile: "+94 718170084",
      phone: "+94 41 2222681 Ext 14101",
      email: "lalithyapa@chem.ruh.ac.lk",
    },
    {
      position: "Joint Secretary / RISTCON 2026",
      name: "Dr. H.A.D.S.D. Perera",
      department: "Department of Physics, Faculty of Science, University of Ruhuna, Matara, Sri Lanka.",
      mobile: "+94 719091183",
    },
    {
      position: "Joint Secretary / RISTCON 2026",
      name: "Dr. K.D. Prasangika",
      department: "Department of Mathematics, Faculty of Science, University of Ruhuna, Matara, Sri Lanka.",
    },
  ],
};