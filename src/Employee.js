import React,{Component} from "react";
import { variabels } from "./Variables";

export class Employee extends Component {

    
    constructor(props) {
        super(props);
        this.state ={
            departments:[],
            employees:[],
            modalTitle:"",
            employeeName:"",
            employeeId:0,
            departmentId:0,
            dateOfJoining:"",
            photoFileName:"Anonymous.jpg",
            pathToPhotos:variabels.PHOTO_URL
        }
    }

    refreshList()
    {
        fetch(variabels.API_URL+'/employees')
        .then(response=>response.json())
        .then(data=>
            {
                this.setState({employees:data});
            });

        fetch(variabels.API_URL+'/departments')
        .then(response=>response.json())
        .then(data=>
            {
                this.setState({departments:data});
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    changeEmployeeName=(e)=>{
        this.setState({employeeName:e.target.value})
    }

    changeDepartment=(e)=>{
        this.setState({departmentId:e.target.value})
    }

    changeDateOfJoining=(e)=>{
        this.setState({dateOfJoining:e.target.value})
    }

    departmentName = (id)=>
    {
        let matchedDep = this.state.departments.find(dep=>dep.departmentId === id);
        return matchedDep != null ? matchedDep.departmentName :"";
    }

    addClick(){
        this.setState({
            modalTitle:"Add Employee",
            employeeId:0,
            employeeName:"",
            dateOfJoining:"",
            photoFileName:"Anonymous.jpg"
        })
    }

    editClick(emp){
        this.setState({
            modalTitle:"Edit Employee",
            employeeId:emp.employeeId,
            employeeName:emp.employeeName,
            departmentId:emp.departmentId,
            dateOfJoining:emp.dateOfJoining,
            photoFileName:emp.photoFileName
        })
    }

    createClick(){
        fetch(variabels.API_URL+'/employees',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                employeeName:this.state.employeeName,
                departmentId:this.state.departmentId,
                dateOfJoining:this.state.dateOfJoining,
                photoFileName:this.state.photoFileName
            })
            })
            .then(res=>res.json())
            .then(result=>{
                alert(`employee ${result.employeeName} created sucessfully.`);
                this.refreshList();
            },(error)=>{
                alert("failed");
            })
    }

    updateClick(){
        fetch(variabels.API_URL+'/employees/'+this.state.employeeId,{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                employeeId:this.state.employeeId,
                employeeName:this.state.employeeName,
                departmentId:this.state.departmentId,
                dateOfJoining:this.state.dateOfJoining,
                photoFileName:this.state.photoFileName
            })
            })
            .then(res=>res.json())
            .then((result)=>{
                alert(result);
                this.refreshList();
            },(error)=>{
                alert("update failed");
            })
    }

    deleteClick(id){
        if(window.confirm("Are you sure ?")) {

        fetch(variabels.API_URL+'/employees/'+id,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
            })
            .then(res=>res.json())
            .then((result)=>{
                alert(result);
                this.refreshList();
            },(error)=>{
                alert("delete failed");
            })
        }
    }

    imageUpload=(e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append("file",e.target.files[0],e.target.files[0].name);
        fetch(variabels.API_URL+'/employees/savefile',{
            method:'POST',
            body:formData
        })
        .then(res=>res.json())
        .then(data=>{
            this.setState({photoFileName:data});
        })
    }

    render() {
        const {employees,departments,modalTitle,employeeName,employeeId,
            dateOfJoining,pathToPhotos,photoFileName} = this.state;
        return(
            <div>
                <button type="button"
                className="btn btn-primary m-2 float-end"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={()=>this.addClick()}>
                    Add Employee
                </button>
               <table className="table table-striped">
                   <thead>
                        <tr>
                            <th>
                                Employee Id
                            </th>
                            <th>
                                Employee Name
                            </th>
                            <th>
                                Department Name
                            </th>
                            <th>
                                Date of Joining
                            </th>
                            <th>
                                Options
                            </th>
                        </tr>
                   </thead>
                   <tbody>
                       { employees.map(emp=>
                            <tr key={emp.employeeId}>
                                <td>{emp.employeeId}</td>
                                <td>{emp.employeeName}</td>
                                <td>{this.departmentName(emp.departmentId)}</td>
                                <td>{emp.dateOfJoining}</td>
                                <td>
                                    <button type="button"
                                     className="btn btn-light mr-1" 
                                     data-bs-toggle="modal"
                                     data-bs-target="#exampleModal"
                                     onClick={()=>this.editClick(emp)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>
                                    </button>

                                    <button type="button"
                                    className="btn btn-light mr-1"
                                    onClick={()=>this.deleteClick(emp.employeeId)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                        </svg>
                                    </button>

                                </td>
                            </tr>
                            )
                       }
                   </tbody>
               </table>
               <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
<div className="modal-dialog modal-lg modal-dialog-centered">
<div className="modal-content">
   <div className="modal-header">
       <h5 className="modal-title">{modalTitle}</h5>
       <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
       ></button>
   </div>

   <div className="modal-body">
    <div className="d-flex flex-row bd-highlight mb-3">
     
     <div className="p-2 w-50 bd-highlight">
    
        <div className="input-group mb-3">
            <span className="input-group-text">Employee Name :</span>
            <input type="text" className="form-control"
            value={employeeName}
            onChange={this.changeEmployeeName}/>
        </div>

        <div className="input-group mb-3">
            <span className="input-group-text">Department Name :</span>
            <select className="form-select"
            onChange={this.changeDepartment}>
                {departments.map(dep=>
                <option key={dep.departmentId} value={dep.departmentId}>
                    {dep.departmentName}
                </option>)}
            </select>
        </div>

        <div className="input-group mb-3">
            <span className="input-group-text">Date of Joining :</span>
            <input type="date" className="form-control"
            value={dateOfJoining}
            onChange={this.changeDateOfJoining}/>
        </div>


     </div>
     <div className="p-2 w-50 bd-highlight">
         <img width="250px" height="250px"
         src={pathToPhotos+photoFileName}/>
         <input className="m-2" type="file" onChange={this.imageUpload}/>
     </div>
    </div>

    {employeeId==0?
        <button type="button"
        className="btn btn-primary float-start"
        onClick={()=>this.createClick()}
        >Create</button>
        :null}

        {employeeId!=0?
        <button type="button"
        className="btn btn-primary float-start"
        onClick={()=>this.updateClick()}
        >Update</button>
        :null}
   </div>

</div>
</div> 
</div>


</div>
        )
    }
}