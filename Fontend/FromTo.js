const token=localStorage.getItem('token');

let premiumsub=false;
window.addEventListener('DOMContentLoaded',()=>{
    axios.post('http://13.230.60.79:2121/ispremium',{token})
    .then(response=>{
        console.log(response);
        if(response.status!=200){
            window.location.href="user.html";


        }
        else if(response.status===200){
            premiumsub=response.data;

        }

    })

})
function logout(){
    localStorage.removeItem('token');
   window.location.href='login.html'
}
window.addEventListener('DOMContentLoaded',()=>{
    axios.post('http://13.230.60.79:2121/downloadlist',{token})
    .then(response=>{
        for(let i=0;i<response.data.length;i++){
            downloadlistresponse(response.data[i],i)

        }
       
    })

})
function downloadlistresponse(response,i){
    const d=document.getElementById('downloadlist');
    const c=`<li> <a href="${response.url}">expense${i} </a> <p>download on ${response.createdAt}</p></li>`
    d.innerHTML=d.innerHTML+c;

}


let MainFrom;
let MainTo;

const form=document.getElementById('form');
form.addEventListener("submit",fromto);

function fromto(e){
    e.preventDefault();

    const From=e.target.From.value;
    const To=e.target.To.value;

    if(To>From){
        axios.post('http://13.230.60.79:2121/fromto?items=5',{token,From,To})
        .then(response=>{
            MainFrom=From;
            MainTo=To;
            
            console.log(response);
            if(response.status=200){
                const numsperpage=document.getElementById('numsperpage');

            const s=`       <select name="numexpp" id="numexpp" >
                            
                            <option value="5" selected>5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20" >20</option>
                          

                            </select>`

            numsperpage.innerHTML=numsperpage.innerHTML+s;
            Main(response.data.response);
            createpages(response.data.totalpages);
            const downloadbutt=document.getElementById('downloadbutton');
            downloadbutt.innerHTML=`<button onclick="downloadexpense()">download</button>`

            numexpp=document.getElementById('numexpp');

            numexpp.addEventListener("change",loaditemsperpage);




            }

       })
    }        
}

function loaditemsperpage(){
    document.getElementById('pagination').innerHTML=""
    document.getElementById('ul_id').innerHTML="";
    numexpp=document.getElementById('numexpp');
    let v=numexpp.value;
    axios.post(`http://13.230.60.79:2121/fromto?items=${v}`,{token,From:MainFrom,To:MainTo})
    .then(response=>{
        Main(response.data.response);
        createpages(response.data.totalpages);

    })
    
}

function Main(response){

for(let i=0;i<response.length;i++){
    ShowExpenseOnScreen(response[i]);

}
}

function ShowExpenseOnScreen(expenseList){
var show=document.getElementById('ul_id');
const res=` <div id="expenselist${expenseList.id}" style="display: flex;  flex-direction: row;gap: 0px;"><h4 >${expenseList.expenseAmount}--</h4><h4 >${expenseList.category}--</h4> <h4>${expenseList.description}--</h4> <h4> on->${expenseList.createdAt}</h4>`

show.innerHTML=show.innerHTML+res;

}

function createpages(totalpages){
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
axios.post(`http://13.230.60.79:2121/fromto?page=${i}`,{token,From:MainFrom,To:MainTo})
.then(response=>{
Main(response.data.response);

})


}

function downloadexpense(){
    axios.post('http://13.230.60.79:2121/downloadexpense',{token,From:MainFrom,To:MainTo})
    .then(response=>{
        console.log(response)
        if(response.status === 200){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
           
            a.click();
        } else {
            throw new Error(response.data.message)
        }
    })
    .catch((err) => {
        console.log(err);
        showError(err)
   

    })
}