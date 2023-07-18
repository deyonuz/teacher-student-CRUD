let TeacherRow = document.querySelector(".teacher-row");
let TeacherForm = document.querySelector(".teacher-form");
let paganation = document.querySelector(".pagination");
let categoryModal = document.querySelector("#categoryModal");
let modalBtn = document.querySelector(".modal-btn");
let addBtn = document.querySelector("#add-btn");
let serchInput = document.querySelector("#search");
let studentSelect = document.querySelector(".student-selekt");

let select = null;
let page = 1;
let search1 = "";
let order = "asc";

let query = new URLSearchParams(location.search);

let student = query.get("teacher");

function getStudentCard({
  avatar,
  firstName,
  lastName,
  email,
  phoneNumber,
  birthday,
  Iswork,
  select = null,
  id,
}) {
  return `

<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
<div class="card">
  <img src=${avatar} class="card-img-top" alt="..." />
  <div class="card-body">
 
  <h5 class="card-tel">data: ${birthday ? birthday.split("T")[0] : ""}</h5>
    <h3 class="card-title">${firstName}</h3>     
  <p class="card-text">Teacher ${select}</p>
    <p class="card-text">${lastName}</p>
    <p class="card-text">${email}</p>
    <h5 class="card-tel">${phoneNumber ? phoneNumber : "Error"}</h5>
    <h5 class="card-tel">${Iswork ? "ishlaydi" : "ishlamaydi"}</h5>
    <button class="btn btn-success"
    data-bs-toggle="modal" 
   data-bs-target="#categoryModal"
   onClick= "editTeacher(${id})"
   >
  
   Edit</button>
   <button class="btn btn-danger " 
   id="btnChangeBg"
   onClick= "deletTeacher(${id})"
   >Delete</button>
  </div>
</div>
</div>

`;
}

function getStudent() {
  loaderToggle(true);

  axiosInstance(
    `teacher/${student}/student?page=${page}&limit=${LIMIT}&firstName=${search1}&sortBy=firstName&order=${order}`
  )
    .then((res) => {
      let studentdata = res.data;

      axiosInstance(`teacher/${student}/student/?firstName=${search1}`).then(
        (res) => {
          let pages;

          pages = Math.ceil(res.data.length / LIMIT);

          if (pages >= 1) {
            paganation.innerHTML = `
            <li onclick="getPage(${page - 1})" ${page === 1 ? "disabled" : ""}
             class="page-item paganation-item"><span class="page-link">Previous</span></li>
            `;

            for (let i = 1; i <= pages; i++) {
              paganation.innerHTML += `
                <li class="page-item ${i == page ? "active" : ""}">
                <button class="page-link" onClick="getPage(${i})">${i}</button>
                </li>
                `;
            }

            paganation.innerHTML += `
              <li    onclick="getPage(${page + 1
              })" class="page-item paganation-item"><span class="page-link">Next</span></li>
              `;
          } else {
            paganation.innerHTML = "";
          }
        }
      );

      TeacherRow.innerHTML = "";
      loaderToggle(false);
      studentdata.forEach((student) => {
        TeacherRow.innerHTML += getStudentCard(student);
      });
    })
    .catch((err) => {
      alert("Error");
      loaderToggle(false);
    });
}

function getPage(p) {
  page = p;
  active = page;
  getStudent();
}

getStudent();

TeacherForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let avatar = TeacherForm.elements.avatar.value;
  let firstName = TeacherForm.elements.firstname.value;

  let email = TeacherForm.elements.email.value;

  let phoneNumber = TeacherForm.elements.number.addEventListener(
    "input",
    function () {
      let inputValue = TeacherForm.elements.number.value;
      let phoneRegex = /^\+998\((87|9[0-9])\)(\d{3}-\d{2}-\d{2})$/;
      let isPhoneValid = phoneRegex.test(inputValue);
      TeacherForm.elements.number.setCustomValidity(
        isPhoneValid
          ? ""
          : "Please enter a valid phone number in the format +998(87)123-45-67."
      );
    }
  );
  // let birthday = TeacherForm.elements.birthday.value;

  let isWork = TeacherForm.elements.family.checked;
  let lastName = TeacherForm.elements.lastname.value;
  let birthday = document.getElementById("data").value;

  let data = {
    firstName,
    lastName,
    avatar,
    isWork,
    phoneNumber,
    birthday,
    email,
  };

  console.log(data);

  if (select === null) {
    axiosInstance.post(`teacher/${student}/student`, data).then((res) => {
      bootstrap.Modal.getInstance(categoryModal).hide();
      console.log(res.data);
      getStudent();
    });
  } else {
    axiosInstance
      .post(`teacher/${student}/student/${select}`, data)
      .then((res) => {
        bootstrap.Modal.getInstance(categoryModal).hide();
        console.log(select);
        getStudent();
      });
  }
});

serchInput.addEventListener("keyup", function () {
  search1 = this.value;
  getStudent();
});

// async function editTeacher(id) {
//   select = id;
//   let teacher = await axiosInstance(`teacher/${student}/student/${id}`);
//   TeacherForm.elements.avatar.value = teacher.data.avatar;
//   TeacherForm.elements.lastname.value = teacher.data.lastName;
//   TeacherForm.elements.firstname.value = teacher.data.firstName;
//   TeacherForm.elements.family.checked = teacher.data.isMarri;
//   TeacherForm.elements.email.value = teacher.data.email;
//   TeacherForm.elements.number.value = teacher.data.phoneNumber;

//   modalBtn.innerHTML = "Save changes";
// }

async function editTeacher(id) {
  select = id;
  let teacher = await axiosInstance(`teacher/${student}/student/${id}`);
  TeacherForm.elements.avatar.value = teacher.data.avatar;
  TeacherForm.elements.lastname.value = teacher.data.lastName;
  TeacherForm.elements.firstname.value = teacher.data.firstName;
  TeacherForm.elements.family.checked = teacher.data.isWork;
  TeacherForm.elements.email.value = teacher.data.email;
  TeacherForm.elements.number.value = teacher.data.phoneNumber;
  document.getElementById("data").value = teacher.data.birthday;
  modalBtn.innerHTML = "Save changes";
}


TeacherForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let avatar = TeacherForm.elements.avatar.value;
  let firstName = TeacherForm.elements.firstname.value;

  let email = TeacherForm.elements.email.value;

  let phoneNumber = TeacherForm.elements.number.value;

  let isWork = TeacherForm.elements.family.checked;
  let lastName = TeacherForm.elements.lastname.value;
  let birthday = document.getElementById("data").value;

  let data = {
    firstName,
    lastName,
    avatar,
    isWork,
    phoneNumber,
    birthday,
    email,
  };

  if (select === null) {
    axiosInstance.post(`teacher/${student}/student`, data).then((res) => {
      bootstrap.Modal.getInstance(categoryModal).hide();
      console.log(res.data);
      getStudent();
    });
  } else {
    axiosInstance.put(`teacher/${student}/student/${select}`, data).then((res) => {
      bootstrap.Modal.getInstance(categoryModal).hide();
      console.log(select);
      getStudent();
    });
  }
});




addBtn.addEventListener("click", function () {
  select = null;
  modalBtn.innerHTML = "add Student";
  TeacherForm.reset();
});

function selectSudent({ firstName }) {
  return `
  
  <option value="${firstName}">${firstName}</option>
  `;
}

function getselect() {
  axiosInstance(`teacher`)
    .then((res) => {
      let studentdata = res.data;

      studentSelect.innerHTML = "";

      studentdata.filter((student) => {
        student.isMarri;

        studentSelect.innerHTML += selectSudent(student);
      });
    })
    .catch((err) => {
      alert("Error");
    });
}

getselect();


async function deletTeacher(id) {
  let check = confirm("Do you want to delete this Student");
  if (check) {
    await axiosInstance.delete(`teacher/${student}/student/${id}`);
    getStudent();
  }
}


