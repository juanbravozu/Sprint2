window.addEventListener('load', () => {

    //Lista para poner los datos de cada persona
    var dataObjectList = [];

    //Query selectors
    const select = document.getElementById('select');
    const result = document.querySelector('.images');
    const ageRange = document.getElementById('age');
    const heightRange = document.getElementById('height');
    const weightRange = document.getElementById('weight');
    const petsRange = document.getElementById('pets');

    select.addEventListener('change', updateComparison);
    ageRange.addEventListener('input', updateComparison);
    heightRange.addEventListener('input', updateComparison);
    weightRange.addEventListener('input', updateComparison);
    petsRange.addEventListener('input', updateComparison);

    //Se llama al archivo .csv con los datos
    fetch('../resources/sprint2_data.csv')
    .then(response => response.text())
    .then(data => {
        //Se dividen los datos por filas. Cada fila contiene los datos de una persona
        displayResults(data.split('\n').slice(1));
    });

    //Crea los elementos visuales a partir de los datos
    function displayResults(rows) {
        rows.forEach((row) => {
            //Separa los datos de la fila 
            const values = row.split(',');
            values[3] = parseInt(values[3]);

            //Crea un JSON a partir de esos datos
            const dataObject = {
                name: values[0],
                age: values[1],
                weight: values[2],
                height: values[3],
                pets: values[4],
            }

            //Agrega las opciones a la lista deplegable
            const option = document.createElement('option');
            option.setAttribute('value', values[0]);
            option.innerHTML = values[0];

            //Incluye la imagen de la persona en la gráfica
            const image = document.createElement('img');
            image.setAttribute('src', './resources/img/'+dataObject.name+'.jpg');
            image.dataset.value = dataObject.name;
            
            result.appendChild(image);
            select.appendChild(option);

            //Agrega el objeto con los datos de la persona a la lista
            dataObjectList.push(dataObject);
        }); 

        updateComparison();
    }

    //Calcula la similitud a partir de los parámetros dados por los sliders y el select
    function updateComparison() {

        //Diferencia a la persona que fue seleccionada en la lista desplegable
        let selected;
        dataObjectList.forEach((data) => {
            if(select.value == data.name) selected = data;
        });

        //Lista para guardar los resultados de la comparación entre la persona seleccionada y el resto de personas
        let results = [];
        dataObjectList.forEach((data) => {
            const productoPunto = ((selected.age * ageRange.value) * (data.age * ageRange.value)) + ((selected.weight * weightRange.value) * (data.weight * weightRange.value)) + ((selected.height * heightRange.value) * (data.height * heightRange.value)) + ((selected.pets * petsRange.value) * (data.pets * petsRange.value));
            const magA = Math.sqrt(((selected.age * ageRange.value) * (selected.age * ageRange.value)) + ((selected.weight * weightRange.value) * (selected.weight * weightRange.value)) + ((selected.height * heightRange.value) * (selected.height * heightRange.value)) + ((selected.pets * petsRange.value) * (selected.pets * petsRange.value)));
            const magB = Math.sqrt(((data.age * ageRange.value) * (data.age * ageRange.value)) + ((data.weight * weightRange.value) * (data.weight * weightRange.value)) + ((data.height * heightRange.value) * (data.height * heightRange.value)) + ((data.pets * petsRange.value) * (data.pets * petsRange.value)));

            let resultValue;

            //Condición para evitar divisiones entre 0
            if(magA > 0 && magB > 0) {
                resultValue = productoPunto / (magA * magB);
            } else {
                resultValue = 0;
            }

            //Añade el resultado a la lista
            results.push({
                name: e.name,
                result: resultValue,
            });
        });

        //Ordena la lista de acuerdo a los resultados de forma descendente
        results.sort(orderResults);
        
        const images = document.querySelectorAll('img');

        //Posiciona las imágenes de la persona a partir del orden de los resultados
        results.forEach((e, index) => {
            let selectedImg;
            images.forEach((img) => {
                if(img.dataset.value == e.name) selectedImg = img;
            });
            selectedImg.style.left = (3 + (51 * index)) + 'px';

            selectedImg.style.top = (195 - (e.result * 195)) + 'px';
        });
    }  

    function orderResults(a, b) {
        if(a.result > b.result) {
            return -1;
        } else if(a.result < b.result) {
            return 1;
        } else {
            return 0;
        }
    }
});