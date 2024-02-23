const container = document.querySelector(`#container`);

html = `  
<div id="slika">
<div class="region" id="logo">
    <a href="index.html"><img src="assets/images/logo.webp" alt="Logo" /></a>
</div>

</div>

<div class="cistac"></div>


<div class="okvir">
<h2>NASA PONUDA OLD TIMER AUTOMOBILA</h2>
<div id="filtriranjeSortiranje">
    <div class="centar">

        <div id="filteri">

            <div id="filtriranje">
                <label for="sortMarka">Sortiraj prema ceni: <input type="button" name="dugme" id="sortMarka"
                        value="Sortiraj rastuce"> </label>

                <form action="" method="">

                    <input type="text" id="tbDeoModel" name="tbDeoModel"
                        placeholder="&#x1F50D Potrazite Vas model" />
                </form>
                <form action="" method="">
                    <label for="rnCena">Cena u opsegu od 0 do <span id="cenaIzbor">50000</span>: </label>
                    <input type="range" min="0" max="50000" value="100000" id="rnCena">

                    <div class="transmisija">
                        <label for="">Transmisija:</label>
                        automatik <input type="checkbox" name="checkA" id="checks" value="automatik">
                        manuelni <input type="checkbox" name="checkM" id="checks" value="manuelni">
                    </div>
                </form>
            </div>
        </div>
        <div class="cistac"></div>
    </div>
</div>

<div id="artikli">

</div>

</div>
<div class="cistac"></div>
</div>
<div class="cistac"></div>

<div id="modal">
</div>`;

container.innerHTML = container.innerHTML + html;

let proizvodi;
let sort = 1;

document.querySelector(`#tbDeoModel`).addEventListener("keyup", filterChange);
document.querySelector(`#rnCena`).addEventListener("change", filterChange);
document.querySelector(`#sortMarka`).addEventListener("click", function () {
  if (sort == 0) {
    sort = 1;
  } else {
    sort = 0;
  }
  filterChange();
});

const chekPolja = document.querySelectorAll(`#checks`);
chekPolja.forEach((elem) => {
  elem.addEventListener("change", filterChange);
});

function preuzmiPodatke() {
  let xHr = new XMLHttpRequest();

  xHr.addEventListener("readystatechange", function () {
    if (this.readyState == 4 && this.status == "200") {
      ispisiArtikle(JSON.parse(this.responseText));
      proizvodi = JSON.parse(this.responseText);
    }
  });

  xHr.open("GET", "./assets/js/data.json");
  xHr.send();
}

function ispisiArtikle(data) {
  const element = document.querySelector(`#artikli`);

  data = filterText(data);
  data = filterCene(data);
  data = sortEl(data);
  data = filterCheck(data);

  let ispis = ``;
  data.forEach((elem) => {
    ispis += `
        <div class="blok">
                <img src="${elem.slika.putanja}" alt="${elem.slika.alt}" />
                <h3>${elem.marka} - ${elem.model}</h3>
                `;

    if (elem.popust == 0) {
      ispis += `<h4>${elem.cena} €</h4>  `;
    } else {
      ispis += `<h6>Stara cena: <s>${elem.cena} €</s></h6>`;
      let novaCena = elem.cena - (elem.cena / 100) * elem.popust;
      ispis += `<h4>Nova cijena: ${novaCena}€</h4>`;
    }
    ispis += `<a class="korpaText" href="#" data-id="${elem.id}">DODAJ U KORPU</a>
    </div>`;
  });

  if (data.length == 0) {
    element.innerHTML = "<p>Nemamo u ponudi Vase kriterijume</p>";
  } else {
    element.innerHTML = ispis;
  }

  const dugmici = document.querySelectorAll(`.korpaText`);
  dugmici.forEach((elem) => {
    elem.addEventListener("click", prikaziModal);
  });
}

preuzmiPodatke();

function prikaziModal(e) {
  e.preventDefault();

  let id = parseInt(e.target.dataset.id);

  let elem = proizvodi.filter((elem) => id == elem.id)[0];

  let ispis = `  
  <div class="modal-content blok">
  <span class="close">&times;</span>
  <img src="${elem.slika.putanja}" alt="${elem.slika.alt}" />
    <h3>${elem.marka} - ${elem.model}</h3>
    <ul>
      <li>Godina proizvodnje: ${elem.specifikacije.godinaProizvodnje}</li>
       <li>Kubikaza: ${elem.specifikacije.kubikaza} cm³</li>
       <li>Snaga motora (kw): ${elem.specifikacije.snagaMotora}</li>
       <li>Kilometraza: ${elem.specifikacije.kilometraza}</li>
       <li>Gorivo: ${elem.specifikacije.gorivo}</li>
       <li>Transmisija: ${elem.specifikacije.transmisija}</li>
       <li>Boja: ${elem.specifikacije.boja}</li>
     </ul>`;
  if (elem.popust == 0) {
    ispis += `<h4>${elem.cena} €</h4>  `;
  } else {
    ispis += `<h6>Stara cena:<s>${elem.cena} €</s></h6>`;
    let novaCena = elem.cena - (elem.cena / 100) * elem.popust;
    ispis += `<h4>Nova cijena: ${novaCena}€</h4>`;
  }
  ispis += `<a class="korpaText" href="#" data-id="${elem.id}">DODAJ U KORPU</a>
    </div>`;

  document.querySelector(`#modal`).innerHTML = ispis;
  document.querySelector(`#modal`).style.display = "block";
  document.querySelector(`.close`).addEventListener("click", function () {
    document.querySelector(`#modal`).innerHTML = ``;
    document.querySelector(`#modal`).style.display = "none";
  });
}

function filterChange() {
  ispisiArtikle(proizvodi);
}



function filterText(data) {
  const value = document.querySelector(`#tbDeoModel`).value;

  if (value != ``) {
    let noviNiz = data.filter(function (elem) {
      if (
        elem.model.toLowerCase().indexOf(value.trim().toLowerCase()) != -1 ||
        elem.marka.toLowerCase().indexOf(value.trim().toLowerCase()) != -1
      ) {
        return elem;
      }
    });
    return noviNiz;
  }
  return data;
}





function filterCene(data) {
  let cena = document.querySelector(`#rnCena`).value;

  document.querySelector(`#cenaIzbor`).textContent = cena;

  return data.filter(function (elem) {
    if (elem.popust == 0) {
      if (elem.cena <= cena) {
        return elem;
      }
    } else {
      let cenaPopu = elem.cena - (elem.cena * elem.popust) / 100;

      if (cenaPopu <= cena) {
        return elem;
      }
    }
  });
}

function sortEl(data) {
  if (sort == 1) {
    data.sort((a, b) => {
      if (a.cena > b.cena) {
        return 1;
      }

      if (a.cena < b.cena) {
        return -1;
      }

      if (a.cena == b.cena) {
        return 0;
      }
    });

    document.querySelector("#sortMarka").value = "Sortiraj rastuce";
    return data;
  } else if (sort == 0) {
    data.sort((a, b) => {
      if (a.cena < b.cena) {
        return 1;
      }

      if (a.cena > b.cena) {
        return -1;
      }

      if (a.cena == b.cena) {
        return 0;
      }
    });

    document.querySelector("#sortMarka").value = "Sortiraj opadajuce";
    return data;
  } else {
    return data;
  }
}

function filterCheck(data) {
  const automatikCheckbox = document.querySelector(`input[value="automatik"]`);
  const manuelniCheckbox = document.querySelector(`input[value="manuelni"]`);

  if (!automatikCheckbox.checked && !manuelniCheckbox.checked) {
    return data;
  }

  return data.filter(function (elem) {
    if (
      automatikCheckbox.checked &&
      elem.specifikacije.transmisija.toLowerCase() === "automatik"
    ) {
      return true;
    }

    if (
      manuelniCheckbox.checked &&
      elem.specifikacije.transmisija.toLowerCase() === "manuelni"
    ) {
      return true;
    }
    return false;
  });
}
