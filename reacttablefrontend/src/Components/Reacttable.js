import React, { Component } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";

class Reacttable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipments: [],
      newShipment: {
        name: "",
        quantity: 0,
        image: null,
      },
      editShipment: {
        name: "",
        quantity: 0,
        image: null,
      },
      isEditing: false,
      showmodel:false,  
    };
  }

  componentDidMount() {
    this.getShipments();
    this.deletemultiple();
  
  }
  

  getShipments() {
    axios
      .get("https://localhost:7225/api/Shipment")
      .then((response) => {
        this.setState({ shipments: response.data });
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addInput = (e) => {
    const { name, value } = e.target;
    this.setState((prevdata) => ({
      newShipment: { ...prevdata.newShipment, [name]: value },
    }));
  };
  editInput = (e) => {
    const { name, value } = e.target;
    this.setState((prevdata) => ({
      editShipment: { ...prevdata.editShipment, [name]: value },
    }));
  };
  handleAddImageChange = (event) => {
    const imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState((prevState) => ({
        newShipment: { ...prevState.newShipment, image: reader.result },
      }));
    };
    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  };
  handleEditImageChange = (event) => {
    const imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState((prevState) => ({
        editShipment: { ...prevState.editShipment, image: reader.result },
      }));
    };
    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, quantity, image } = this.state.newShipment;
    if (name.length === 0) {
      alert("Please Enter Name");
    }
    if (!image) {
      alert("Please Select Image");
    }
    try {
      const response = await axios.post("https://localhost:7225/api/Shipment", {
        name,
        quantity,
        image,
      });
      this.setState((prevState) => ({
        shipments: [...prevState.shipments, response.data],
        newShipment: {
          name: "",
          quantity: 0,
          image: null,
        },
      }));
    }catch (error) {
      console.error("something wrong to  add shipment:", error);
    }
  };
  Deletedata = async (Id) => {
    try {
      await axios.delete(`https://localhost:7225/api/Shipment?id=${Id}`);
      this.setState((prevState) => ({
        shipments: prevState.shipments.filter((shipment) => shipment.id !== Id),
      }));
    } catch (error) {
      console.error("Error deleting shipment:", error);
    }
  };
  editData = (shipment) => {
    this.setState({
      isEditing: true,
      editShipment: { ...shipment },
    });
  };
  cancelbutton = () => {
    this.setState({
      isEditing: false,
      editShipment: {
        id: null,
        name: "",
        quantity: 0,
        image: null,
      },
    });
  };
  EditSubmitbutton = async (e) => {
    e.preventDefault();
    const { id, name, quantity, image } = this.state.editShipment;
    try {
      await axios.put(`https://localhost:7225/api/Shipment`, {
        id,
        name,
        quantity,
        image,
      });
      this.setState((e) => ({
        shipments: e.shipments.map((shipment) => {
          if (shipment.id === id) {
            return { ...shipment, name, quantity, image };
          } else {
            return shipment;
          }
        }),
        isEditing: false,
      }));
    } catch (error) {
      console.error("Error editing shipment:", error);
    }
  };
  downloadPDF = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const marginLeft = 40;
    const document = new jsPDF(orientation, unit, size);
    document.setFontSize(15);
    const title = "Shipment Detail";
    const headers = [["Name", "Quantity"]];
    const data = this.state.shipments.map((e) => [e.name, e.quantity]);
    let content = {
      startY: 50,
      head: headers,
      body: data,
    };
    document.text(title, marginLeft, 40);
    document.autoTable(content);
    document.save("report.pdf");
  };
  downloadExcelFile = () => {
    const { shipments } = this.state;
    const data = shipments.map(({ name, quantity }) => ({
      Name: name,
      Quantity: quantity,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shipments");
    XLSX.writeFile(workbook, "shipments.xlsx");
  };
  handlecheckbox = (e) => {
    const {name, checked } = e.target;
    if (name === "allselect") {
      const checkedValue = this.state.shipments.map((shipment) => ({ ...shipment,  ischecked: checked, }));
      this.setState({ shipments: checkedValue });
    } else {
      const checkedValue = this.state.shipments.map((e) =>  e.id == name ? { ...e, ischecked: checked } : e );
      console.log(checkedValue);
      this.setState({ shipments: checkedValue });
    }
  };
  deletemultiple = async () => {
    const checkedShipments = this.state.shipments.filter((shipment) => shipment.ischecked);
    try {
      for (const shipment of checkedShipments) {
        await axios.delete(`https://localhost:7225/api/Shipment?id=${shipment.id}`);
      } 
      this.setState((prevState) => ({
        shipments: prevState.shipments.filter((shipment) => !shipment.ischecked),
      }));
    } catch (error) {
      console.error("Error deleting shipments:", error);
    }
  };  
  Editmultiple=async(e)=>{
   const checkedId = this.state.shipments.filter((shipment) => shipment.ischecked).map((shipment) => shipment.id);
   e.preventDefault();
   const { id, name, quantity, image } = this.state.editShipment;
   if (name.length === 0) {
    alert("Please Enter Name");
  }
  if (!image) {
    alert("Please Select Image");
  }
   try {
    for (const id of checkedId) {
      await axios.put(`https://localhost:7225/api/Shipment`, {
        id,
        name,
        quantity,
        image,
      });
      this.setState((e) => ({
        shipments: e.shipments.map((shipment) => {
          if (shipment.id === id) {
            return { ...shipment, name, quantity, image };
          } else {
            return shipment;
          }
        }),
        showmodel:false,
    }));
  }
  } catch (error) {
    console.error("Error deleting shipments:", error);
  }
  };
  handleopenmodel=()=>{
    this.setState({showmodel:true}) 
  }
  handleclosemodel=()=>{
    this.setState({showmodel:false})
  }
  render(){
    const isAnyShipmentChecked = this.state.shipments.some((shipment) => shipment.ischecked);
    return (
      <div style={{ backgroundColor: "#add8e6" }}>
        <h1>Shipment</h1>
        <div style={{ paddingLeft: "70%" }}>
          <button onClick={() => this.downloadPDF()}>
          <i class="fa-solid fa-file-pdf"style={{color:"red"}}></i>
          </button>&nbsp;
          <button onClick={this.downloadExcelFile}><i class="fa-regular fa-file-excel" style={{color:"green"}}></i></button>&nbsp;
        <CSVLink data={this.state.shipments} filename={"shipments.csv"}>
        <button><i class="fa-solid fa-file-csv"   style={{color:"#87CEEB"}}></i></button>
          </CSVLink>
        </div>
        <div
          style={{
            backgroundColor: " #808080",
            width: "30%",
            margin: "auto",
            border: "1px dashed black",
          }}
        >
          {this.state.isEditing ? (
            <form onSubmit={this.EditSubmitbutton}>
              <div style={{ marginRight: "29%" }}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.editShipment.name}
                  onChange={this.editInput}
                />
              </div>
              <br />
              <div style={{ marginRight: "30%" }}>
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={this.state.editShipment.quantity}
                  onChange={this.editInput}
                />
              </div>
              <br />
              <div>
                <label>Image:</label>
                <input
                  type="file"
                  name="image"
                  placeholder="Select img"
                  onChange={this.handleEditImageChange}
                />
              </div>
              <br />
              <button type="submit">Edit Shipment</button>
              <button type="button" onClick={this.cancelbutton}>
                Cancel
              </button>
            </form>
          ) : 
            !this.state.showmodel &&(<form onSubmit={this.handleSubmit}>
              <div style={{ marginRight: "29%" }}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.newShipment.name}
                  onChange={this.addInput}
                />
              </div>
              <br />
              <div style={{ marginRight: "30%" }}>
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={this.state.newShipment.quantity}
                  onChange={this.addInput}
                />
              </div>
              <br />
              <div>
                <label>Image:</label>
                <input
                  type="file"
                  name="image"
                  onChange={this.handleAddImageChange}
                />
              </div>
              <br />
              <button type="submit">Add Shipment</button>
            </form>
          )}
        </div>
        <div style={{marginRight:"60%"}}>
        {isAnyShipmentChecked && (
          <button onClick={this.deletemultiple} style={{color:"red"}}>Delete Selected</button>)}&nbsp;
          {isAnyShipmentChecked && (<button onClick={this.handleopenmodel}style={{color:"blue"}}>Edit Selected</button>)}
        </div>
        {this.state.showmodel &&(<div>

          <table style={{ marginLeft: "14%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> <input type="text" name="name"  value={this.state.editShipment.name}
                  onChange={this.editInput}/></td>
              <td> <input type="number" name="quantity"  value={this.state.editShipment.quantity}
                  onChange={this.editInput}/></td>
              <td> <input type="file" name="image"   onChange={this.handleEditImageChange}/></td>
              <td><button onClick={this.Editmultiple}>Save</button></td>
              <td><button onClick={this.handleclosemodel}>Cancel</button></td>
            </tr>
          </tbody>
          </table>
        </div>)}
        <table
          className="user-table"
          style={{ width: "80%", height: "80%px", margin: "auto" }}
        >
          <thead>
            <tr>
              <th></th>
              <th><input type="checkbox" name="allselect" checked={!this.state.shipments.some((e)=>e.ischecked!==true)} onChange={this.handlecheckbox}/></th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Image</th>
              <th>Button</th>
            </tr>
          </thead>
          <tbody>
            {this.state.shipments.map((shipment, index) => (
              <tr key={index} style={{ border: "1px dashed black" }}>
                <td>
                  <details>
                  <summary></summary>
                    <p>Shipment Name:{shipment.name}</p>
                    <p>Shipment quantity:{shipment.quantity}</p>
                  </details>
                </td>
                <td>
                  <div >
                  <input type="checkbox" name={shipment.id} checked={shipment?.ischecked || false} onChange={this.handlecheckbox} />
                  </div>
                </td>
                <td>{shipment.name}</td>
                <td>{shipment.quantity}</td>
                <td>
                  <img
                    className="img-style"
                    src={shipment.image}
                    alt={`Cover of ${shipment.name}`}
                  />
                </td>
                <td>
                  <button type="button" onClick={() => this.editData(shipment)}>
                  <i class="fas fa-edit" style={{color:"black"}}></i>
                  </button>&nbsp;
                  <button
                    type="button"
                    onClick={() => this.Deletedata(shipment.id)}
                  >
                  <i class="fas fa-trash" style={{color:"red"}}></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export default Reacttable;
