const products = [
  {id:1,name:"ONLY ZX Oversized T-Shirt",price:799,cat:"T-Shirts",color:"Black"},
  {id:2,name:"ZX Wide-Leg Lower",price:1099,cat:"Lowers",color:"Olive Green"},
  {id:3,name:"ZX Essential Shirt",price:999,cat:"Shirts",color:"White"},
  {id:4,name:"ZX Relaxed Jeans",price:1499,cat:"Jeans",color:"Washed Blue"},
  {id:5,name:"ZX Heavy Hoodie",price:1499,cat:"Hoodies",color:"Black"},
  {id:6,name:"ZX Utility Jacket",price:1799,cat:"Jackets",color:"Black"},
  {id:7,name:"ZX Women's Oversized Tee",price:799,cat:"Women T-Shirts",color:"Cream"},
  {id:8,name:"ZX Women's Essential Top",price:699,cat:"Tops",color:"Beige"},
  {id:9,name:"ZX Women's Shirt",price:999,cat:"Women Shirts",color:"White"},
  {id:10,name:"ZX Women's Jeans",price:1499,cat:"Women Jeans",color:"Blue"}
];

let cart = JSON.parse(localStorage.getItem("onlyzx-cart") || "[]");

function money(n){return "₹"+n.toLocaleString("en-IN")}
function filterProducts(cat){
  document.getElementById("categoryFilter").value=cat;
  renderProducts();
}
function renderProducts(){
  const q=(document.getElementById("searchInput").value||"").toLowerCase();
  const cat=document.getElementById("categoryFilter").value;
  const list=products.filter(p=>(cat==="All"||p.cat===cat)&&p.name.toLowerCase().includes(q));
  document.getElementById("products").innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-img">
        <div class="product-placeholder"></div>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${money(p.price)}</p>
        <small>${p.color} · ${p.cat}</small>
        <button class="add" onclick="addToCart(${p.id})">ADD TO CART</button>
      </div>
    </article>`).join("") || "<p>No products found.</p>";
}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;
  else cart.push({id,qty:1});
  saveCart(); openCart();
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  saveCart(); renderCart();
}
function saveCart(){localStorage.setItem("onlyzx-cart",JSON.stringify(cart));renderCart()}
function renderCart(){
  const el=document.getElementById("cartItems");
  document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
  if(!cart.length){el.innerHTML='<p style="color:#777">Your cart is empty.</p>';document.getElementById("cartTotal").textContent="₹0";return}
  let total=0;
  el.innerHTML=cart.map(x=>{
    const p=products.find(y=>y.id===x.id); total+=p.price*x.qty;
    return `<div class="cart-item"><div class="cart-thumb"></div><div><h4>${p.name}</h4><p>${money(p.price)} · ${p.color}</p><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> ${x.qty} <button onclick="changeQty(${p.id},1)">+</button></div></div><strong>${money(p.price*x.qty)}</strong></div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=money(total);
}
function openCart(){renderCart();document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
function focusSearch(){document.getElementById("searchInput").focus();document.getElementById("new").scrollIntoView()}
function checkoutWhatsApp(){
  if(!cart.length){alert("Cart is empty.");return}
  // CHANGE THIS NUMBER to your WhatsApp number with country code, e.g. 919876543210
  const whatsappNumber="919971566545";
  const lines=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `${p.name} x${x.qty} - ${money(p.price*x.qty)}`}).join("%0A");
  const total=cart.reduce((a,x)=>a+products.find(y=>y.id===x.id).price*x.qty,0);
  const msg=`Hello ONLY ZX WEAR,%0A%0AI want to place an order:%0A${lines}%0A%0ATotal: ${money(total)}%0A%0AName:%0AAddress:%0APincode:%0APhone:`;
  window.open(`https://wa.me/${whatsappNumber}?text=${msg}`,"_blank");
}
function openPolicy(type){
  const content=type==="shipping"
    ? `<h2>Shipping</h2><p>Orders are normally dispatched after confirmation. Update this text with your real delivery timeline and shipping charges before launch.</p>`
    : `<h2>Returns & Exchanges</h2><p>Update this section with your actual return, exchange and refund policy before accepting orders.</p>`;
  document.getElementById("policyContent").innerHTML=content;
  document.getElementById("policyModal").classList.add("show");
}
function closePolicy(){document.getElementById("policyModal").classList.remove("show")}
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
document.querySelector(".menu-btn").addEventListener("click",()=>{
  const nav=document.querySelector(".nav"); nav.style.display=nav.style.display==="flex"?"":"flex";
});
