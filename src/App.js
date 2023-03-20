
import { useEffect, useState } from 'react';
import './App.css';
import List from "./List";
import { uid } from 'uid';
import axios from 'axios';
/* eslint-disable */

function App() {
  const [contacts, setContacts] = useState([]);

    const [formData, setFormData]=useState({
      name:"",
      telpn:"",
    });
    const [isUpdate, setIsUpdate]=useState({
      id: null, 
      status: false
    });

    useEffect(()=>{
      //mengambil data
      axios.get('http://localhost:3000/contacts').then((res)=>{
        console.log(res.data);
        setContacts(res?.data ?? [])
      });
    },[])    

    function handleChange(e){
      let data = {...formData};
      data[e.target.name]=[e.target.value];
      setFormData(data);
    }
    function handleSubmit(e){
      e.preventDefault();
      alert("oke");
      let data = [...contacts];

      if (formData.name === ""){
        return false;
      }
      if(formData.telpn === ""){
        return false;
      }

      if(isUpdate.status){
        data.forEach((contact)=>{
          if(contact.id===isUpdate.id){
            contact.name = formData.name;
            contact.telpn = formData.telpn;

            axios.put(`http://localhost:3000/contacts/${isUpdate.id}`, {
              name: formData.name,
              telpn : formData.telpn
            }).then((res)=>{
              alert("data berhasil diupdate");
            })
          }
        });
      }else{
        let newData = {id: uid(), name: formData.name, telpn: formData.telpn};
        data.push(newData);
        
        axios.post('http://localhost:3000/contacts', newData ).then((res)=>{
          alert("berhasil menyimpan data")
        })
      }
      //menambahkan data
      setIsUpdate({id:null, status:false})
      setContacts(data);
      setFormData({name:"",telpn:""})
    }
    function handleEdit(id){
      let data = [...contacts];
      let foundData = data.find((contact)=>contact.id===id);
      setFormData({name: foundData.name, telpn: foundData.telpn})
      setIsUpdate({id: id, status: true});
    }
    function handleDelete(id){
      let data = [...contacts];
      let filterData = data.filter((contact)=>contact.id!==id);
      setContacts(filterData);

      axios.delete(`http://localhost:3000/contacts/${id}`).then((res)=>{
        alert("data berhasil di delete");
      })
    }
  return (
    <>
    <div className="App">
      <h1 className="px-3 py-3">My Contact List</h1>

      <form onSubmit={handleSubmit} className="px-3 py-4">
        <div className="form-group">
          <label htmlFor="">Name</label>
          <input 
          type="text" 
          className="form-control" 
          name="name"
          onChange={handleChange}
          value={formData.name} />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="">No. Telp</label>
          <input 
          type="text" 
          className="form-control" 
          name="telpn"
          onChange={handleChange}
          value={formData.telpn} />
        </div>
        <div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Save
          </button>
        </div>
      </form>
      <List handleDelete={handleDelete} handleEdit={handleEdit} data={contacts} />
    </div>

    </>
  );
}

export default App;
