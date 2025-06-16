import React, { useState, useEffect } from "react";

const StudentForm = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [marks, setMarks] = useState(["", "", "", "", ""]);
  const [students, setStudents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState("");
  const [preview, setPreview] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterDivision, setFilterDivision] = useState("All");

  const handleMarksChange = (value, index) => {
    const updatedMarks = [...marks];
    updatedMarks[index] = value;
    setMarks(updatedMarks);
  };

  const calculateResult = (marksArray) => {
    const total = marksArray.reduce((a, b) => a + b, 0);
    const percentage = (total / 500) * 100;
    let division = "Fail";
    if (percentage >= 60) division = "First Division";
    else if (percentage >= 45) division = "Second Division";
    else if (percentage >= 33) division = "Third Division";
    return {
      percentage: percentage.toFixed(2),
      division,
    };
  };

  useEffect(() => {
    const numMarks = marks.map(Number);
    if (numMarks.every((m) => !isNaN(m) && m >= 0 && m <= 100)) {
      const res = calculateResult(numMarks);
      setPreview(res);
    } else {
      setPreview(null);
    }
  }, [marks]);

  const handleSubmit = () => {
    setErrors("");

    if (!/^[A-Za-z ]+$/.test(name.trim())) {
      setErrors("Name should only contain letters and spaces.");
      return;
    }

    const numAge = Number(age);
    if (!Number.isInteger(numAge) || numAge <= 0 || numAge > 100) {
      setErrors("Age should be a positive integer between 1 and 100.");
      return;
    }

    const numMarks = marks.map(Number);
    if (numMarks.some((mark) => isNaN(mark) || mark < 0 || mark > 100)) {
      setErrors("All marks must be between 0 and 100.");
      return;
    }

    const result = calculateResult(numMarks);
    const newStudent = {
      name: name.trim(),
      age: numAge,
      marks: numMarks,
      percentage: result.percentage,
      division: result.division,
    };

    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = newStudent;
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([...students, newStudent]);
    }

    setName("");
    setAge("");
    setMarks(["", "", "", "", ""]);
    setPreview(null);
  };

  const handleEdit = (index) => {
    const student = students[index];
    setName(student.name);
    setAge(student.age);
    setMarks(student.marks.map(String));
    setEditIndex(index);
    setErrors("");
  };

  const handleDelete = (index) => {
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
  };

  const filteredStudents = students.filter((s) => {
    const nameMatch = s.name.toLowerCase().includes(filterName.toLowerCase());
    const divisionMatch =
      filterDivision === "All" || s.division === filterDivision;
    return nameMatch && divisionMatch;
  });

  return (
    <div className="container mt-5 d-flex flex-column flex-md-row gap-4">
      {/* Form Section */}
      <div className="card shadow p-4" style={{ width: "370px" }}>
        <h4 className="mb-3 text-center text-primary fw-bold">
          🎓 Student Record
        </h4>
        {errors && <div className="alert alert-danger py-2">{errors}</div>}

        <label className="form-label">Student Name</label>
        <input
          className="form-control mb-2"
          type="text"
          placeholder="e.g. Ajeet Yadav"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="form-label">Age</label>
        <input
          className="form-control mb-2"
          type="number"
          placeholder="1 - 100"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        {marks.map((mark, idx) => (
          <div key={idx}>
            <label className="form-label">Marks {idx + 1}</label>
            <input
              className="form-control mb-2"
              type="number"
              placeholder="0 - 100"
              value={mark}
              onChange={(e) => handleMarksChange(e.target.value, idx)}
            />
          </div>
        ))}

        {preview && (
          <div className="alert alert-info py-2 text-center">
            <strong>Preview:</strong>
            <br />
            Percentage: <strong>{preview.percentage}%</strong> <br />
            Division:{" "}
            <span
              className={`badge ${
                preview.division === "First Division"
                  ? "bg-success"
                  : preview.division === "Second Division"
                  ? "bg-primary"
                  : preview.division === "Third Division"
                  ? "bg-warning text-dark"
                  : "bg-danger"
              }`}
            >
              {preview.division}
            </span>
          </div>
        )}

        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-success w-50 me-2" onClick={handleSubmit}>
            {editIndex !== null ? "Update" : "Submit"}
          </button>
          <button
            className="btn btn-outline-secondary w-50"
            onClick={() => {
              setName("");
              setAge("");
              setMarks(["", "", "", "", ""]);
              setEditIndex(null);
              setErrors("");
              setPreview(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div
        className="bg-dark text-white p-3 rounded shadow overflow-auto"
        style={{ width: "100%", height: "520px" }}
      >
        <h5 className="mb-3 text-white text-center">📋 Student Records</h5>

        {/* Filter Section */}
        <div className="mb-3 d-flex flex-column flex-md-row gap-3 justify-content-center">
          <input
            type="text"
            className="form-control w-100 w-md-50"
            placeholder="Search by Name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          <select
            className="form-select w-100 w-md-25"
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
          >
            <option value="All">All Divisions</option>
            <option value="First Division">First Division</option>
            <option value="Second Division">Second Division</option>
            <option value="Third Division">Third Division</option>
            <option value="Fail">Fail</option>
          </select>
        </div>

        {filteredStudents.length === 0 ? (
          <p className="text-center mt-5">No matching records found.</p>
        ) : (
          <table className="table table-bordered table-sm table-dark text-center align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                {[...Array(5)].map((_, i) => (
                  <th key={i}>M{i + 1}</th>
                ))}
                <th>%</th>
                <th>Division</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, idx) => (
                <tr key={idx}>
                  <td>{s.name}</td>
                  <td>{s.age}</td>
                  {s.marks.map((m, i) => (
                    <td key={i}>{m}</td>
                  ))}
                  <td>{s.percentage}</td>
                  <td>
                    <span
                      className={`badge ${
                        s.division === "First Division"
                          ? "bg-success"
                          : s.division === "Second Division"
                          ? "bg-primary"
                          : s.division === "Third Division"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                    >
                      {s.division}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-light"
                      onClick={() => handleEdit(idx)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(idx)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentForm;
