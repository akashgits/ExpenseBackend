const token=localStorage.getItem('token')

let premiumsub=false;
let totalItems=0;
let snum=3;
let pagi=1;
document.addEventListener('DOMContentLoaded',premium);
function premium(){
    axios.post('http://13.230.60.79:2121/ispremium',{token})
    .then(response=>{
        console.log(response);
        if(response.status===200){
            premiumsub=true;      
            document.body.style.backgroundColor='lightpink';
            document.getElementById('premiumsub').innerHTML='<h4>premium subscriber</h4>';
            premiumExpense();

        }
        else{
            NormalExpense();
        }
    })
};

function fromto(){
    if(premiumsub){
        window.location.href='FromTo.html';


    }
    else{
        alert('subcribe to premium')
    }


}
function leaderboard(){
    if(premiumsub){
        window.location.href='leaderboard.html';
    }
    else{
        alert('subcribe to premium')
    }

}

function logout(){
    localStorage.removeItem('token');
    window.location.href='login.html';

}


const form=document.getElementById('form');

form.addEventListener('submit',PostToUser);

function PostToUser(e){
    e.preventDefault();
    const expenseAmount=e.target.expenseAmount.value;
    const description=e.target.description.value;
    const category=e.target.category.value;

    console.log(expenseAmount+'is'+description+'on'+category);
    axios.post(`http://13.230.60.79:2121/add-expense`,{token,expenseAmount,description,category}).
    then(response=>{
        totalItems=totalItems+1;
        console.log(response)
        na(response.data)
       
      
    })

    
}
function na(response){
    console.log(response)
    document.getElementById('expenseAmount').value='';
    document.getElementById('description').value='';
    document.getElementById('category').value='';
   // window.location.reload();
   ShowExpenseOnScreen(response);
   insertBeforefun();
//    if(premiumsub==true){
//     removelastelemet()
//    }
console.log(totalItems+ "<l---l>"+(snum*pagi));
   if(totalItems>(snum)){
    console.log(totalItems+ "<l---l>"+(snum*pagi));

        if(premiumsub==true){
            removelastelemet()
           }
        const pagination=document.getElementById('pagination');
        pagination.innerHTML="";
    
        createPages(pagi+1);

   }



}
function removelastelemet(){
    const show=document.getElementById('ul_id');
    show.removeChild(show.lastElementChild)

}
function insertBeforefun(){
    const show=document.getElementById('ul_id');
    show.insertBefore(show.lastElementChild,show.firstElementChild)

    //console.log(show.lastChild)
    // const res=` <div id="expenselist${expenseList.id}" style="display: flex;  flex-direction: row;gap: 150px;"><h4 >${expenseList.expenseAmount}</h4><h4 >${expenseList.category}</h4> <h4>${expenseList.description}</h4> 
    //  <button onclick="deleteUser(${expenseList.id})" style="height: 30px;margin-top: 13px;">delete</button></div>`;
    //  show.insertBefore(res,show.children[0]);
}
function premiumExpense(){
    const insertexpnumpp=document.getElementById('insertnumexpp');
    const s=`       <select name="numexpp" id="numexpp" >
    <option value="3" selected>3</option>
    <option value="5">5</option>
    <option value="10">10</option>
    <option value="15">15</option>

</select>`
insertexpnumpp.innerHTML=s;
const numexpp=document.getElementById('numexpp');
let v=numexpp.value;

loadPremiumUser(v);
numexpp.addEventListener('change',changeitemsperpage);



}
function changeitemsperpage(){
    const numexpp=document.getElementById('numexpp');
let v=numexpp.value;
loadPremiumUser(v);

}
function loadPremiumUser(v){
    var show=document.getElementById('ul_id');
    show.innerHTML="";
    const pagination=document.getElementById('pagination');
    pagination.innerHTML="";

    axios.post(`http://13.230.60.79:2121/getpremiumexpense?items=${v}`,{token})
    .then(response=>{
        console.log(response);
        if(response.data.respon.length>0){
            totalItems=response.data.totalItems;
            snum=v;
            pagi=response.data.totalpages;
            Main(response.data.respon);
            createPages(response.data.totalpages)

        }

    })


}
function createPages(totalpages){
    if(totalpages>1){
        for(let i=1;i<=totalpages;i++){
            createpagination(i);

        }
        
    }

}
function createpagination(i){
    const pagination=document.getElementById('pagination');
    if(i===1){
        const p=`<h5 class="link Active" id="page(${i})" onclick="page(${i})">${i}</h5>`
        pagination.innerHTML=pagination.innerHTML+p;
    }
    else{
        const p=`<h5 class="link " id="page(${i})" onclick="page(${i})">${i}</h5>`
        pagination.innerHTML=pagination.innerHTML+p;

    }
   


}
function page(i){
    var show=document.getElementById('ul_id');
    show.innerHTML="";
    axios.post(`http://13.230.60.79:2121/getpremiumexpense?page=${i}`,{token})
    .then(response=>{
        Main(response.data.respon);
        
    })
    
    
}


function NormalExpense(){

    console.log('normal')
    loadExpenseForUser();

}
function loadExpenseForUser(){
    console.log('load')
    console.log(token)
    
    axios.post('http://13.230.60.79:2121/getexpense',{token:token})
   .then(response=>{
    Main(response.data);
    console.log(response.data)

   })
}


function Main(response){

    for(let i=0;i<response.length;i++){
        ShowExpenseOnScreen(response[i]);

    }
//     const last=document.getElementById('ul_id');
// console.log(last.lastElementChild)

}

function ShowExpenseOnScreen(expenseList){
    console.log('in yhr ')
    console.log(expenseList);
    var show=document.getElementById('ul_id');
    const res=` <div id="expenselist${expenseList.id}" style="display: flex;  flex-direction: row;gap: 0px;"><h4 >${expenseList.expenseAmount}--</h4><h4 >${expenseList.category}--</h4> <h4>${expenseList.description}</h4> 
     <button onclick="deleteUser(${expenseList.id})" style="height: 30px;margin-top: 17px;margin-left: 20px; border-radius:10px">delete</button></div>`
    show.innerHTML=show.innerHTML+res;
    
}

function deleteUser(id){
    axios.post(`http://13.230.60.79:2121/deleteexpense`,{id})
    .then(response=>{
        console.log(response)
        if(response.status==200){
            const r=  document.getElementById(`expenselist${id}`);
            r.remove();
            var show=document.getElementById('ul_id');
            console.log("this is"+ show.childElementCount);
            if(show.childElementCount===0){
                const pagination=document.getElementById('pagination');
                pagination.removeChild(pagination.lastElementChild);
                page(1);

            }


        }
        else{
            alert(`oops plese try again`)
        }
       

    })
 


}


 async function buypremium(e){

      //  e.preventDefault();
        const response  = await axios.post('http://13.230.60.79:2121/razorpay', {token} );
        console.log(response);
        var options =
        {
         "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
         "name": "Test Company",
         "order_id": response.data.order.id, // For one time payment
         "prefill": {
           "name": "Test User",
           "email": "test.user@example.com",
           "contact": "6303458143"
         },
         "theme": {
          "color": "#3399cc"
         },
         // This handler function will handle the success payment
         "handler": function (response) {
             console.log(response);
             axios.post('http://13.230.60.79:2121/updatetransaction',{
                 order_id: options.order_id,
                 payment_id: response.razorpay_payment_id,
             }, { headers: {"Authorization" : token} }).then(() => {
                
                 alert('You are a Premium User Now')
                // premimumFun(true)
             }).catch(() => {
                 alert('Something went wrong. Try Again!!!')
             })
         },
      };


      const rzp1 = new Razorpay(options);
      rzp1.open();
     // e.preventDefault();

      rzp1.on('payment.failed', function (response){
        alert("payment failed");
        // alert(response.error.description);
        // alert(response.error.source);
        // alert(response.error.step);
        // alert(response.error.reason);
        // alert(response.error.metadata.order_id);
        // alert(response.error.metadata.payment_id);
    });

   
}



