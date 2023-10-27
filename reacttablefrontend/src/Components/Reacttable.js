
import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import {  CSVLink } from "react-csv";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Shipments: [],
      newShipment: {
      name: "",
      quantity: 0,
      image: null, },
      isedit: false,
      isadd:false,
      editShipment: {
        id: null, 
        name: "",
        quantity: 0,
      },
            search: '',
            filter: [],
            selectedIds: [],
            
    };
  }
  componentDidMount() {
    this.getShipments();
  }

  Deletedata = async (Id) => {
    try {
      await axios.delete(`https://localhost:7225/api/Shipment?id=${Id}`);
      this.setState((prevState) => ({
        Shipments: prevState.Shipments.filter((shipment) => shipment.id !== Id),
        filter: prevState.filter.filter((shipment) => shipment.id !== Id)

      }));
    } catch (error) {
      console.error("Error deleting shipment:", error);
    }
  };

  getShipments() {
    axios
      .get("https://localhost:7225/api/Shipment")
      .then((response) => {
        this.setState({ Shipments: response.data ,filter:response.data});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  editData = (id) => {
    const shipment = this.state.Shipments.find((shipment) => shipment.id === id);
    if (shipment) {
      this.setState({
        isedit: true,
        editShipment: { ...shipment },
      });
    }
  };
  cancelbutton = () => {
    this.setState({ isedit: false,isadd: false,});
  }
  EditSubmitbutton = async (e) => {
    e.preventDefault();
    const { id, name, quantity,image } = this.state.editShipment;
    try {
      await axios.put(`https://localhost:7225/api/Shipment?id=${id}`, {
        id,
        name,
        quantity,
        image,
      });
      this.setState((prevState) => ({
        filter: prevState.Shipments.map((shipment) => {
          if (shipment.id === id) {
            return { ...shipment, name, quantity,image };
          } else {
            return shipment;
          }
        }),
        isedit: false,
      }));
    } catch (error) {
      console.error("Error editing shipment:", error);
    }
  };
  editInput = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      editShipment: { ...prevState.editShipment, [name]: value },
    }));
  };
  adddata=()=>{
    this.setState({
        isadd: true,
        newShipment: {
          name: "",
          quantity: 0,
          image: null, },
      });
  }
  addInput = (e) => {
         const { name, value } = e.target;
        this.setState((prevdata) => ({
          newShipment: { ...prevdata.newShipment, [name]: value },
         }));
       };
       addsearch = (e) => {
        const { name, value } = e.target;
       this.setState((prevdata) => ({
         search: { ...prevdata.search, [name]: value },
        }));
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
            Shipments: [...prevState.Shipments, response.data],
            filter: [...prevState.filter, response.data],
            isadd: false,
          }));
        } catch (error) {
          console.error("something wrong to add shipment:", error);
        }
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
  handleSearchChange = (e) => {
        const search = e.target.value;
        const result = this.state.Shipments.filter((e) => {
            return e.name.toLowerCase().includes(search.toLowerCase());
        });
        this.setState({ search, filter: result });
    }    
    handleDeleteSelected = async () => {
      const { selectedIds } = this.state;
      try {
       
        for (const id of selectedIds) {
          await axios.delete(`https://localhost:7225/api/Shipment?id=${id}`);
        }
        this.setState((prevState) => ({
          Shipments: prevState.Shipments.filter((shipment) => !selectedIds.includes(shipment.id)),
          filter: prevState.filter.filter((shipment) => !selectedIds.includes(shipment.id)),
          selectedIds: [],
        }));
      } catch (error) {
        console.error("Error deleting shipments:", error);
      }
    };          
  render() {
    const columns = [
      {
        name: "Name ",
        selector: (e) => e.name,
        sortable: true,
      },
      {
        name: "Quantity",
        selector: (e) => e.quantity,
        sortable: true,
      },
      {
        name: "image",
        selector: (e) => <img height={70} width={70} src={e.image} alt="image" />,
      },
      {
        name: "Actions",
        selector: (e) => (
          <>
            <button className="btn btn-danger" onClick={() => this.editData(e.id)}>
              Edit
            </button>
            &nbsp;
            <button className="btn btn-danger" onClick={() => this.Deletedata(e.id)}>
              Delete
            </button>
          </>
        ),
      },
    ]; 
    return (
      <div>
       <h1>Product List</h1>
        {this.state.isedit &&  <div style={{paddingLeft:"40%"}}>
      <div style={{height:"40%",width:"50%",border:'solid'}}>
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
            <button type="submit">Edit Shipment</button>
            <button type="button" onClick={this.cancelbutton}>
              Cancel
            </button>
          </form>
          </div></div>
        }  {this.state.isadd &&  <div style={{paddingLeft:"40%"}}>
      <div style={{height:"40%",width:"50%",border:'solid'}}>
          <form onSubmit={this.handleSubmit}>
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
            <button type="submit">Save Shipment</button>
            <button type="button" onClick={this.cancelbutton}>
              Cancel
            </button>
          </form>
          </div></div>
        } 
        <button onClick={() => this.adddata()} style={{  marginLeft: "80%" }}>Add Data</button>       
        <DataTable
          columns={columns}
          data={this.state.filter}
          pagination
          selectableRows
          onSelectedRowsChange={({ selectedRows }) => {
            const selectedIds = selectedRows.map((row) => row.id);
            this.setState({ selectedIds });
          }}
          highlightOnHover
          fixedHeader
          defaultSortFieldId={1}
          actions   
          contextActions={<div>
            <button> Edit</button>&nbsp;
            <button onClick={this.handleDeleteSelected}>Delete</button>

            </div>
          }
          expandableRows
          expandableRowExpanded={this.columns}
          subHeader
          subHeaderComponent={
        <div>
         <input
                            type="text"
                            placeholder="Search..."
                            value={this.state.search}
                            onChange={this.handleSearchChange}
                        />
       <button><CSVLink filename="my-file.csv" data={this.state.Shipments}>
        Export to CSV
      </CSVLink>
      </button>
     </div>
    }
        />
      </div>
    );
  }
}

export default Product;
