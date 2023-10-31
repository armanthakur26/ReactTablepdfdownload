
import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import {  CSVLink } from "react-csv";
import jsPDF from "jspdf";

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
      iseditmultiple:false,
      isdelete:false,
      editShipment: { 
        name: "",
        quantity: 0,
        image:null,
      },
            search: '',
            filter: [],
            selectall:[],    
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
  isdeletemodel=()=>{
    this.setState({isdelete:true})
  }
  editDatamultiple = () => {
      this.setState({ iseditmultiple: true, });};
  cancelbutton = () => {
    this.setState({ isedit: false,isadd: false,iseditmultiple:false,isdelete:false});
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
            return {...shipment, name, quantity,image };
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
    this.setState((prevdata) => ({
      editShipment: { ...prevdata.editShipment, [name]: value },
    }));
  };
  editmultiple = async (e) => {
    e.preventDefault();
    const { selectall } = this.state;
    const { id,name, quantity,image} = this.state.editShipment; 
    if (name.length === 0) {
      alert("Please Enter Name");
    }
    if (!image) {
      alert("Please Select Image");
    }
    try {
      for (const ids of selectall) {
        await axios.put(`https://localhost:7225/api/Shipment?id=${ids}`, {
          id:ids,
          name,
          quantity,
          image,
        });
        this.setState((prevState) => ({
          Shipments: [...prevState.Shipments],
          filter: [...prevState.filter],
          iseditmultiple: false,
        }));
        this.getShipments();
      }
    } catch (error) {
      console.error("Error editing shipment:", error);
    }
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
  handleeditimagechange = (event) => {
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
  handleSearchChange = (e) => {
        const search = e.target.value;
        const result = this.state.Shipments.filter((e) => {
            return e.name.toLowerCase().includes(search.toLowerCase());
        });
        this.setState({ search, filter: result });
    }  
    handlealldelete=async() =>{
      const {selectall}=this.state;
      try{
        for(const id of selectall)
        {
          await axios.delete(`https://localhost:7225/api/Shipment?id=${id}`)
          this.setState((prevState) => ({
            Shipments: prevState.Shipments.filter((shipment) => !selectall.includes(shipment.id)),
            filter: prevState.filter.filter((shipment) => !selectall.includes(shipment.id)),
            isdelete:false,
          }));
        }  
      }catch (error) {
        console.error("Error deleting shipment:", error);
      }
    }  
    expandableRowsComponent = (row) => {
      const shipment = this.state.Shipments.find((shipment) => shipment.id === row.data.id);
      if (shipment) {
        return (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px' }}>
            <table style={{ border: '1px solid #000'}}>
              <tr>
                <th style={{  padding: '30px' }}>Name</th>
                <th style={{  padding: '30px' }}>Quantity</th>
                <th style={{  padding: '30px' }}>Image</th>
                <th></th>
                <th></th>
              </tr>
              <tr>
                <td style={{  padding: '30px' }}>{shipment.name}</td>
                <td style={{ padding: '30px' }}>{shipment.quantity}</td>
                <td style={{  padding: '30px' }}>
                  <img src={shipment.image} alt="image" height={80} width={80} />
                </td>
                <td style={{  padding: '30px' }}>
                  <button className="btn btn-danger" onClick={(e) => this.editData(shipment.id)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
                <td style={{  padding: '30px' }}>
                  <button className="btn btn-danger" onClick={(e) => this.Deletedata(shipment.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </table>
          </div>
        );
      }
    }
    
  render() {
    const columns = [
      
      {
        name: "Name",
        selector: (e) => e.name,
        sortable: true,
      },
      {
        name: "Quantity",
        selector: (e) => e.quantity ,
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
            <i className="fas fa-edit"></i>
            </button>
            &nbsp;
            <button className="btn btn-danger" onClick={() => this.Deletedata(e.id)}>
            <i className="fas fa-trash"></i>
            </button>
          </>
        ),
      },
    ]; 
    return (
      <div>
       <h1>Product List</h1>
       {this.state.isdelete && <div className="custom-deletemodel">
      <div className="modal-content">
<h5>Are you sure want to delete data</h5>
            <button className="buttoncss" onClick={this.handlealldelete}>Yes</button>
            <button  className="buttoncss2" type="button" onClick={this.cancelbutton}>NO</button>
    </div>
  </div>
}
       {this.state.iseditmultiple && (
  <div className="custom-modal">
    <div className="modal-content">
      <h2>Edit Shipment</h2>
  <form onSubmit={this.editmultiple}>
            <div >
              <label>Name:</label>
              <input
                type="text"
                name="name"
                 value={this.state.editShipment.name}
                onChange={this.editInput}
              />
            </div>
            <br />
            <div >
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                 value={this.state.editShipment.quantity}
                onChange={this.editInput}
              />
            </div>
            <br />
            <div style={{marginLeft:"18%"}}>
               <label>Image:</label>
               <input
                  type="file"
                  name="image"
                 onChange={this.handleeditimagechange}/>
              </div>
            <button className="buttoncss" type="submit">Edit </button>
            <button  className="buttoncss2" type="button" onClick={this.cancelbutton}>
              Cancel
            </button>
      </form>
    </div>
  </div>
)}
       
   {this.state.isedit && (
  <div className="custom-modal">
    <div className="modal-content">
      <h2>Edit Shipment</h2>
 <form onSubmit={this.EditSubmitbutton}>
            <div >
              <label>Name:</label>
              <input
                type="text"
                name="name"
                 value={this.state.editShipment.name}
                onChange={this.editInput}
              />
            </div>
            <br />
            <div >
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                 value={this.state.editShipment.quantity}
                onChange={this.editInput}
              />
            </div>
            <br />
            <div style={{marginLeft:"18%"}}>
               <label>Image:</label>
               <input
                  type="file"
                  name="image"
                 onChange={this.handleeditimagechange}/>
              </div>
            <button className="buttoncss" type="submit">Edit </button>
            <button  className="buttoncss2" type="button" onClick={this.cancelbutton}>
              Cancel
            </button>
      </form>
    </div>
  </div>
)}
        {this.state.isadd && (
  <div className="custom-modal">
    <div className="modal-content">
      <h2>Add Shipment</h2>
 <form onSubmit={this.handleSubmit}>
            <div >
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={this.state.newShipment.name}
                onChange={this.addInput}
              />
            </div>
            <br />
            <div >
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={this.state.newShipment.quantity}
                onChange={this.addInput}
              />
            </div>
            <br />
            <div style={{marginLeft:"18%"}}>
               <label>Image:</label>
               <input
                  type="file"
                  name="image"
                  onChange={this.handleAddImageChange}
                />
              </div>
            <button className="buttoncss" type="submit">Save</button>
            <button  className="buttoncss2" type="button" onClick={this.cancelbutton}>
              Cancel
            </button>
      </form>
    </div>
  </div>
)}
        <button onClick={() => this.adddata()} style={{  marginLeft: "80%" }}>Add Data</button>       
        <DataTable
          columns={columns}
          data={this.state.filter}
          pagination
          selectableRows
          onSelectedRowsChange={( {selectedRows} ) => {
            const selectall = selectedRows.map((row) => row.id);
            this.setState( {selectall} );
          }}
          highlightOnHover
          fixedHeader
          defaultSortFieldId={1}
          actions   
          contextActions={<div>
            <button onClick={this.editDatamultiple} > <i className="fas fa-edit"></i></button>&nbsp;
            <button onClick={this.isdeletemodel}> <i className="fas fa-trash"></i></button>
            </div>
          }
          expandableRows
          expandableRowExpanded={() =>false}
          expandableRowsComponent={this.expandableRowsComponent}
          subHeader
          subHeaderComponent={
        <div>
         <input
                            type="text"
                            placeholder="Search..."
                            value={this.state.search}
                            onChange={this.handleSearchChange}
                        />
       <button><CSVLink filename="my-file.csv" data={this.state.Shipments}><i class="fa-regular fa-file-excel" style={{color:"green"}}></i></CSVLink> </button>
     </div>
    }
        />
      </div>
    );
  }
}

export default Product;