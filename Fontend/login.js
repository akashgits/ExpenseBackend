document.addEventListener('DOMContentLoaded',isTherelogin);
function isTherelogin(){
     token=localStorage.getItem('token');
    if(token){
        window.location.replace('./user.html');

    }
    
}

const form=document.getElementById('form');

form.addEventListener('submit',login)

function login(e){
    e.preventDefault()
    const email=e.target.email.value;
    const password=e.target.password.value;

    axios.post('http://13.230.60.79:2121/login',{email,password})
    .then(response=>{
        console.log(response);
        if(response.status===200){
            console.log('rrrrr')
            localStorage.setItem('token',response.data.token);
            window.location.href='user.html'
        }
        else if(response.status===201){
            console.log('401')
           let c= document.getElementById('error');
           c.innerHTML='<h4>incorrect password</h4>';
           setTimeout(()=>{
            c.innerHTML="";
           },2000)
           
        }
        else if(response.status==202){
            let c= document.getElementById('error');
            c.innerHTML='<h4>user not found plese sign up </h4>';
            setTimeout(()=>{
                c.innerHTML="";
               },5000)

        }
        else{
            let c= document.getElementById('error');
            c.innerHTML='<h4>please try again</h4>'

        }
    })
    
    .catch(err=>{
        console.log(err);
    })

}
