const particleImages = [
{ img: "pikachu.png"},
{ img: "charmander.png"},
{ img: "bullbasaur.png"},
{ img: "squirtle.png"},
{ img: "pokebola.png"}
];
document.addEventListener('DOMContentLoaded', (e) => {
    fetchParticles();
    const id = pokeRandom(1, 1009);
    fetchPoke(id);
});

const pokeRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const fetchParticles =  async () => {
  try {
    const res = await fetch('./particles.json');
    const data = await res.json();
    let i = Math.floor(Math.random()*particleImages.length);
    let img = particleImages[i].img;
    let imgObject =`./images/${img}`;
    data.particles.shape.image.src = imgObject;
    particlesJS('particles-js', data);
  } catch (error) {
      console.log(error);
  }
};

const fetchPoke = async (id) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    console.log('Completo: ',data);
    const poke = {
      img:data.sprites.other.dream_world.front_default,
      img2:data.sprites.front_default,
      name:data.name,
      hp:data.stats[0].base_stat,
      expe:data.base_experience,
      attack:data.stats[1].base_stat,
      defense:data.stats[2].base_stat,
      especially:data.stats[3].base_stat

    };
    paintCard(poke);
  } catch (error) {
      console.log(error);
  }
};

const paintCard = (poke) => {
  console.log('Pokemon: ',poke);
  const flexMain = document.querySelector('.flex');
  const template = document.getElementById('template-card').content;
  const clone = template.cloneNode(true);
  const fragment = document.createDocumentFragment();
  //----------------------------------------------------------------
  const device = whatIsMyDevice();
  const card = clone.querySelector('.card');
  if(device === 'mobile') {
    card.style.width = '90%';
  }else if(device === 'web'){
    card.style.width = '500px';
  }
  //----------------------------------------------------------------
  clone.querySelector('.card-body-img').setAttribute('src', poke.img === null || undefined ? poke.img2 : poke.img);
  clone.querySelector('.card-body-name').innerHTML = `${poke.name} <span class="card-body-age">${poke.hp} Hp</span>`;
  clone.querySelector('.card-body-expe').innerHTML = `${poke.expe==null ? 'No especifica' : poke.expe+' Exp'} <span><img src="./images/girar.png" alt="Reload" class="card-body-imgReload" style="cursor:pointer"></span>`;
  clone.querySelectorAll('.card-footer-stats h3')[0].textContent = `${poke.attack}`;
  clone.querySelectorAll('.card-footer-stats h3')[1].textContent = `${poke.defense}`;
  clone.querySelectorAll('.card-footer-stats h3')[2].textContent = `${poke.especially}`;
  fragment.appendChild(clone);
  flexMain.appendChild(fragment);
  //----------------------------------------------------------------
  const btnReload = document.querySelector('.card-body-imgReload');
  btnReload.addEventListener('click', (e) => {
    location.reload();
  });
};

// function disableScroll(){ 
//   window.onscroll = null;
// }
// document.addEventListener('scroll', disableScroll);

const whatIsMyDevice = () => {
  const device = navigator.userAgent;
  
  if (device.match(/Android/i) || 
      device.match(/webOS/i) || 
      device.match(/iPhone/i) || 
      device.match(/iPad/i) || 
      device.match(/iPod/i) || 
      device.match(/BlackBerry/i) || 
      device.match(/Windows Phone/i)){
        console.log("Estás usando un dispositivo móvil!!");
        return 'mobile'
        //card.style.width = '85%';
  }else{
        console.log("No estás usando un móvil");
        return 'web'
        //card.style.width = '400px';
  }
};


        