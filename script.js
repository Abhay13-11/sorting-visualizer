let array=[]
let size=80
let speed=50

let container=document.getElementById("array")

let audio=new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3")

let ctx=document.getElementById("timeChart").getContext("2d")

let timeChart=new Chart(ctx,{
type:"line",
data:{
labels:[],
datasets:[{
label:"Sorting Time (seconds)",
data:[],
borderColor:"cyan",
fill:false
}]
},
options:{
responsive:true,
scales:{
y:{
beginAtZero:true
}
}
}
})

function generateArray(){

array=[]
container.innerHTML=""

document.getElementById("complexity").innerText=""

for(let i=0;i<size;i++){

let value=Math.floor(Math.random()*350)+10
array.push(value)

let bar=document.createElement("div")
bar.classList.add("bar")

let hue=(value/400)*360
bar.style.background="hsl("+hue+",80%,50%)"

bar.style.height=value+"px"

container.appendChild(bar)

}

generateComparisonArrays()

}

window.onload=generateArray

document.getElementById("newArray").onclick=generateArray

document.getElementById("size").addEventListener("input",function(){
size=this.value
generateArray()
})

document.getElementById("speed").addEventListener("input",function(){
speed=this.value
})

function sleep(ms){
return new Promise(resolve=>setTimeout(resolve,ms))
}

function disableButtons(){
document.getElementById("newArray").disabled=true
document.getElementById("bubble").disabled=true
document.getElementById("merge").disabled=true
document.getElementById("quick").disabled=true
}

function enableButtons(){
document.getElementById("newArray").disabled=false
document.getElementById("bubble").disabled=false
document.getElementById("merge").disabled=false
document.getElementById("quick").disabled=false
}

async function bubbleSort(){

let bars=document.getElementsByClassName("bar")

for(let i=0;i<array.length;i++){

for(let j=0;j<array.length-i-1;j++){

bars[j].classList.add("compare")
bars[j+1].classList.add("compare")

await sleep(101-speed)

if(array[j]>array[j+1]){

audio.currentTime=0
audio.play()

bars[j].classList.add("swap")
bars[j+1].classList.add("swap")

let temp=array[j]
array[j]=array[j+1]
array[j+1]=temp

bars[j].style.height=array[j]+"px"
bars[j+1].style.height=array[j+1]+"px"

await sleep(101-speed)

}

bars[j].classList.remove("compare","swap")
bars[j+1].classList.remove("compare","swap")

}

bars[array.length-i-1].classList.add("sorted")

}

}

async function mergeSortStart(){
await mergeSort(array,0,array.length-1)
}

async function mergeSort(arr,l,r){

if(l>=r) return

let mid=Math.floor((l+r)/2)

await mergeSort(arr,l,mid)
await mergeSort(arr,mid+1,r)

await merge(arr,l,mid,r)

}

async function merge(arr,l,mid,r){

let bars=document.getElementsByClassName("bar")

let left=arr.slice(l,mid+1)
let right=arr.slice(mid+1,r+1)

let i=0
let j=0
let k=l

while(i<left.length && j<right.length){

bars[k].classList.add("compare")

await sleep(101-speed)

if(left[i]<=right[j]){
arr[k]=left[i]
bars[k].style.height=left[i]+"px"
i++
}
else{
arr[k]=right[j]
bars[k].style.height=right[j]+"px"
j++
}

bars[k].classList.remove("compare")
k++

}

while(i<left.length){
arr[k]=left[i]
bars[k].style.height=left[i]+"px"
i++
k++
}

while(j<right.length){
arr[k]=right[j]
bars[k].style.height=right[j]+"px"
j++
k++
}

}

async function quickSortStart(){

await quickSort(array,0,array.length-1)

let bars=document.getElementsByClassName("bar")

for(let i=0;i<bars.length;i++){
bars[i].classList.add("sorted")
}

}

async function quickSort(arr,low,high){

if(low<high){

let pi=await partition(arr,low,high)

await quickSort(arr,low,pi-1)
await quickSort(arr,pi+1,high)

}

}

async function partition(arr,low,high){

let bars=document.getElementsByClassName("bar")

let pivot=arr[high]

bars[high].classList.add("swap")

let i=low-1

for(let j=low;j<high;j++){

bars[j].classList.add("compare")

await sleep(101-speed)

if(arr[j]<pivot){

audio.currentTime=0
audio.play()

i++

let temp=arr[i]
arr[i]=arr[j]
arr[j]=temp

bars[i].style.height=arr[i]+"px"
bars[j].style.height=arr[j]+"px"

}

bars[j].classList.remove("compare")

}

let temp=arr[i+1]
arr[i+1]=arr[high]
arr[high]=temp

bars[i+1].style.height=arr[i+1]+"px"
bars[high].style.height=arr[high]+"px"

bars[high].classList.remove("swap")

return i+1

}

function generateComparisonArrays(){

let containerA=document.getElementById("arrayA")
let containerB=document.getElementById("arrayB")

containerA.innerHTML=""
containerB.innerHTML=""

for(let i=0;i<50;i++){

let value=Math.floor(Math.random()*300)+20

let bar1=document.createElement("div")
let bar2=document.createElement("div")

bar1.classList.add("bar")
bar2.classList.add("bar")

bar1.style.height=value+"px"
bar2.style.height=value+"px"

containerA.appendChild(bar1)
containerB.appendChild(bar2)

}

}

let startTime
let endTime

function updateGraph(time){

timeChart.data.labels.push(size)
timeChart.data.datasets[0].data.push(time)
timeChart.update()

}

document.getElementById("bubble").onclick=async ()=>{

disableButtons()

document.getElementById("complexity").innerText="Bubble Sort | Time Complexity: O(n²)"

startTime=performance.now()

await bubbleSort()

endTime=performance.now()

let time=(endTime-startTime)/1000

updateGraph(time)

document.getElementById("complexity").innerText+=" | Time: "+time.toFixed(3)+"s"

enableButtons()

}

document.getElementById("merge").onclick=async ()=>{

disableButtons()

document.getElementById("complexity").innerText="Merge Sort | Time Complexity: O(n log n)"

startTime=performance.now()

await mergeSortStart()

endTime=performance.now()

let time=(endTime-startTime)/1000

updateGraph(time)

document.getElementById("complexity").innerText+=" | Time: "+time.toFixed(3)+"s"

enableButtons()

}

document.getElementById("quick").onclick=async ()=>{

disableButtons()

document.getElementById("complexity").innerText="Quick Sort | Avg Time: O(n log n)"

startTime=performance.now()

await quickSortStart()

endTime=performance.now()

let time=(endTime-startTime)/1000

updateGraph(time)

document.getElementById("complexity").innerText+=" | Time: "+time.toFixed(3)+"s"

enableButtons()

}