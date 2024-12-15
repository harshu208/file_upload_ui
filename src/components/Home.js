import React, { useState,useRef,useContext, useEffect }  from 'react'
import './Home.css'
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {notifications} from '@mantine/notifications';
import axiosInstance from '../axios/axiosInstance';
const Home = () => {
  const [files, setFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const fileInputRef = useRef();
  const { authToken,logout } = useContext(AuthContext);

  const handleFileChange = async (event) => {
    const allowedExtensions = ['txt', 'jpg', 'jpeg', 'pdf', 'json','png'];
    const uploadedFiles = event.target.files;
    const newFileList = [...fileList];
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        console.error(`File type not allowed: ${file.name}`);
        notifications.show({
          title : 'Error',
          message : 'Only txt,jpg,pdf,json,jpeg,png file types are allowed',
          color:'red',
          autoClose:5000
        })
        continue; 
      }
  
      newFileList.push(file);

      const formData = new FormData();
      formData.append('file', file);
      console.log("Uploading...")
      notifications.show({
        title : 'Success',
        message : 'Uploading file',
        color:'red',
        autoClose:5000
      })
      try {
        const response = await axiosInstance.post('/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('File uploaded successfully', response.data);
      }
      catch(err){
        console.error('Error uploading file', err);
        notifications.show({
          title : 'Error',
          message : 'Error uploading file',
          color:'red',
          autoClose:5000
        })
      }
    }
    //setFileList(newFileList);
    fetchFiles();
  }
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  const handleDownload = async (file) => {
    try {
      console.log("file..", file);
      const response = await axiosInstance.get(`http://localhost:5000/file/download/${file._id}`, {
       
        responseType: 'blob', // Ensure the file is treated as a blob
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name); // Set the desired file name
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (err) {
      console.error('Error downloading file', err);
      notifications.show({
        title : 'Error',
        message : 'Error downloading file',
        color:'red',
        autoClose:5000
      })
    }
  };
  const fetchFiles = async () => {
    try{
      //  const response = await axios.get('http://localhost:5000/file', {
      //   headers: {
      //     'Authorization': `Bearer ${authToken}`,
      //   },
      //  })
       const response = await axiosInstance.get('/file');
       console.log('Fetched files: 1', response.data);
       setFileList(response.data);
    }
    catch(err){
      console.error('Error fetching files', err);
    }
 }
  useEffect(() => {
     fetchFiles();
  }, [])
  const signout = async() => {
      try{
         notifications.show({
            title:'success',
            message : 'signing out !!',
            color: 'green',
            autoClose: 5000
         })
         await logout();
      }
      catch(err){

      }
  }
  return (
    <div className='file-container'>
        
        <h1 className='file-heading'>Your File List</h1>
        <button onClick={()=>{signout()}} className='logout'>Sign Out</button>
        <button className='upload-btn' onClick={triggerFileInput}>+ Upload Files</button>

        <input
        type="file"
        multiple
        ref={fileInputRef}  // Using useRef here
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div className='upload-file-container'>
        <h2>Uploaded Files</h2>
        <div className='fileList'>
          {fileList.length > 0 ? (
            fileList.map((file, index) => (
              <div className='file' key={index}>
                <div className='fileName'>{file.name} </div> <button className='download' onClick={() => handleDownload(file)}>Download</button>
              </div>
            ))
          ) : (
            <p className='noFiles'>No files uploaded...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
