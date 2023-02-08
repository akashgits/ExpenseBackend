
const form=document.getElementById('form');
form.addEventListener('submit',signup_details);

function signup_details(e){
    e.preventDefault();
    const name=e.target.name.value;
    const email=e.target.email.value;
    const password=e.target.password.value;

    axios.post('http://13.230.60.79:2121/User-signUp',{name,email,password})
    .then(response=>{
        console.log(response)
        
        if(response.data=='error'){
            const c=document.getElementById('error');
            c.innerHTML='email already used find another one';
            setTimeout(()=>{
                c.innerHTML="";
            },3000)
            

        }
        else{
            localStorage.setItem('token',response.data.token);
            window.location.href=`user.html`
        }


    })

}