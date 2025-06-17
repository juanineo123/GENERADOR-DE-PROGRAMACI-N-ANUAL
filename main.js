document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELECCIÓN DE ELEMENTOS ---
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    // Renombramos downloadBtn a downloadWordBtn para claridad, y añadimos generatePreviewBtn
    const downloadWordBtn = document.getElementById('download-btn-final'); // Este es el botón de descarga final
    const generatePreviewBtn = document.getElementById('generate-preview-btn'); // Nuevo botón para generar la vista previa
    const steps = document.querySelectorAll('.step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const previewContent = document.getElementById('preview-content'); // Contenedor para la vista previa

    // Formulario principal
    const levelSelect = document.getElementById('info-nivel');
    const gradeSelect = document.getElementById('info-grado'); // Corregido: document.getElementById
    const areaSelect = document.getElementById('info-area');
    const periodDivisionSelect = document.getElementById('period-division');
    const organizationContainer = document.getElementById('organization-container');
    const competenciesChecklist = document.getElementById('competencies-checklist'); // Este es el div en el modal

    // Modal de Unidades
    const unitModal = document.getElementById('unit-modal');
    const unitModalTitle = document.getElementById('unit-modal-title');
    const cancelUnitBtn = document.getElementById('cancel-unit-btn');
    const addUnitBtn = document.getElementById('add-unit-btn');
    const unitDetailsFieldset = document.getElementById('unit-details-fieldset');

    // Botones de IA existentes (Justificación, Perfil, Unidad)
    const suggestJustificacionBtn = document.getElementById('suggest-justificacion-btn');
    const suggestPerfilBtn = document.getElementById('suggest-perfil-btn');
    const suggestUnitTitleBtn = document.getElementById('suggest-unit-title-btn');
    const suggestUnitSituacionBtn = document.getElementById('suggest-unit-situacion-btn');
    const suggestUnitProductoBtn = document.getElementById('suggest-unit-producto-btn');

    // NUEVOS BOTONES DE IA AÑADIDOS para Evaluación y Recursos
    const suggestEvalDiagnosticaBtn = document.getElementById('suggest-eval-diagnostica-btn');
    const suggestEvalFormativaBtn = document.getElementById('suggest-eval-formativa-btn');
    const suggestEvalSumativaBtn = document.getElementById('suggest-eval-sumativa-btn');
    const suggestRecursosDocenteBtn = document.getElementById('suggest-recursos-docente-btn');
    const suggestRecursosEstudianteBtn = document.getElementById('suggest-recursos-estudiante-btn');
    // FIN DE NUEVOS BOTONES DE IA

    // --- 2. VARIABLES DE ESTADO ---
    let currentStep = 1;
    let unitsData = {};
    let fullFormData = {}; // Para almacenar todos los datos recopilados para la vista previa y descarga

    // Variable para rastrear la unidad que se está editando o creando
    let currentlyEditing = { periodId: null, unitId: null };

    // --- 3. LÓGICA DE NAVEGACIÓN Y UI ---
    const updateUI = () => {
        prevBtn.style.display = (currentStep === 1) ? 'none' : 'inline-block';
        // El botón 'Siguiente' ahora solo avanza hasta el Paso 7 (Cierre)
        nextBtn.style.display = (currentStep === steps.length - 1) ? 'none' : 'inline-block'; // steps.length es 8, así que avanza hasta el 7

        // Ajuste para el botón "Generar Documento" en el Paso 7
        if (currentStep === 7) {
            generatePreviewBtn.style.display = 'inline-block';
            nextBtn.style.display = 'none'; // Asegurar que el botón Siguiente no aparezca en el Paso 7
        } else {
            generatePreviewBtn.style.display = 'none';
        }

        // Ajuste para el botón "Descargar .docx" en el Paso 8
        if (currentStep === 8) {
            downloadWordBtn.style.display = 'inline-block'; // Mostrar botón de descarga en el paso de vista previa
        } else {
            downloadWordBtn.style.display = 'none';
        }


        progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            const circle = step.querySelector('div');
            const text = step.querySelector('p');
            const isCurrent = stepNum === currentStep;
            circle.classList.toggle('bg-blue-600', isCurrent);
            circle.classList.toggle('text-white', isCurrent);
            circle.classList.toggle('bg-gray-300', !isCurrent);
            circle.classList.toggle('text-gray-500', !isCurrent);
            text.classList.toggle('text-blue-600', isCurrent);
            text.classList.toggle('text-gray-500', !isCurrent);
        });
    };

    const showStep = (stepNumber) => {
        steps.forEach(step => step.classList.remove('active'));
        const stepElement = document.getElementById(`form-step-${stepNumber}`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
        currentStep = stepNumber;
        updateUI();
    };

    nextBtn.addEventListener('click', () => {
        // Avance normal de pasos, pero no más allá del penúltimo (Paso 7)
        if (currentStep < steps.length - 1) { // steps.length es 8, así que avanza hasta el 7
            showStep(currentStep + 1);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });

    // --- 4. LÓGICA DE CONTENIDO DINÁMICO (COMPLETA) ---
    const populateLevels = () => {
        levelSelect.innerHTML = Object.keys(nivelesYGrados).map(level => `<option value="${level}">${level}</option>`).join('');
        levelSelect.value = "Secundaria";
    };

    const populateGrades = () => {
        const selectedLevel = levelSelect.value;
        const grades = nivelesYGrados[selectedLevel] || [];
        gradeSelect.innerHTML = grades.map(grade => `<option value="${grade}">${grade}</option>`).join('');
        if (selectedLevel === "Secundaria") gradeSelect.value = "Tercero";
    };

    // Esta función se encarga de poblar el checklist de competencias en el modal
    const populateCompetenciesChecklist = (selectedArea) => {
        // Asegúrate de que competenciasPorArea esté disponible globalmente (cargado desde data.js)
        const competencies = competenciasPorArea[selectedArea] || {};
        competenciesChecklist.innerHTML = Object.keys(competencies).length > 0 ?
            Object.keys(competencies).map(key =>
                `<div class="bg-white p-3 rounded-md border"><label class="font-semibold text-sm text-gray-800 flex items-start cursor-pointer">
                    <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3 mt-1" name="competencia" value="${key}">
                    <span>${competencies[key].nombre}</span>
                </label></div>`
            ).join('') :
            '<p class="text-sm text-gray-500">No hay competencias definidas para esta área en data.js.</p>';
    };

    const populateEnfoquesTransversales = () => {
        const enfoquesContainer = document.getElementById('enfoques-container');
        enfoquesContainer.innerHTML = '';

        for (const enfoqueKey in enfoquesTransversales) {
            if (enfoquesTransversales.hasOwnProperty(enfoqueKey)) {
                const enfoque = enfoquesTransversales[enfoqueKey];
                const enfoqueTitle = enfoqueKey.replace(/\b\w/g, l => l.toUpperCase());

                let valuesHtml = '';
                for (const valueKey in enfoque) {
                    if (enfoque.hasOwnProperty(valueKey)) {
                        valuesHtml += `<p class="text-sm text-gray-600 mb-1"><strong>${valueKey}:</strong> ${enfoque[valueKey]}</p>`;
                    }
                }

                enfoquesContainer.innerHTML += `
                    <div class="bg-white p-4 rounded-lg border shadow-sm">
                        <label class="flex items-start cursor-pointer mb-2">
                            <input type="checkbox" name="enfoqueTransversal" value="${enfoqueKey}" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3 mt-1">
                            <span class="font-bold text-lg text-gray-800">${enfoqueTitle}</span>
                        </label>
                        <div class="border-t border-gray-200 pt-2 mt-2">
                            ${valuesHtml}
                        </div>
                    </div>
                `;
            }
        }
    };

    // --- 5. LÓGICA DE CALENDARIZACIÓN Y UNIDADES (COMPLETA) ---
    const renderOrganizationPeriods = () => {
        const division = periodDivisionSelect.value;
        const count = (division === 'bimestres') ? 4 : 3;
        const oldData = { ...unitsData };
        unitsData = {};
        organizationContainer.innerHTML = '';

        for (let i = 1; i <= count; i++) {
            let periodName = division;
            if (division === 'bimestres') {
                periodName = 'bimestre';
            } else if (division === 'trimestres') {
                periodName = 'trimestre';
            }
            const periodId = `${periodName}-${i}`;

            unitsData[periodId] = oldData[periodId] || [];
            const periodTitle = periodId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const periodEl = document.createElement('div');
            periodEl.className = 'bg-gray-50 p-4 rounded-lg border';
            periodEl.innerHTML = `
                <div class="flex justify-between items-center mb-3">
                    <h4 class="font-bold text-lg text-gray-700">${periodTitle}</h4>
                    <button data-period-id="${periodId}" class="add-new-unit-btn bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                        + Añadir Unidad
                    </button>
                </div>
                <div id="units-container-${periodId}" class="space-y-3"></div>`;
            organizationContainer.appendChild(periodEl);
            renderUnitsForPeriod(periodId);
        }
    };

    const renderUnitsForPeriod = (periodId) => {
        const container = document.getElementById(`units-container-${periodId}`);
        if (!container) return;
        container.innerHTML = unitsData[periodId].map(unit => {
            const startDate = unit.startDate ? new Date(unit.startDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : 'N/A';
            const endDate = unit.endDate ? new Date(unit.endDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : 'N/A';
            return `
            <div id="card-${unit.id}" class="unit-card bg-white p-3 rounded-md border-l-4 border-blue-500 shadow-sm flex justify-between items-center">
                <div>
                    <p class="font-semibold text-gray-800">${unit.title}</p>
                    <p class="text-xs text-gray-500 font-medium">Del ${startDate} al ${endDate}</p>
                </div>
                <div class="unit-actions flex space-x-2">
                    <button data-period-id="${periodId}" data-unit-id="${unit.id}" class="edit-unit-btn p-2 rounded-md hover:bg-gray-200 transition" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg></button>
                    <button data-period-id="${periodId}" data-unit-id="${unit.id}" class="delete-unit-btn p-2 rounded-md hover:bg-gray-200 transition" title="Eliminar"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" /></svg></button>
                </div>
            </div>`;
        }).join('');
    };

    // --- 6. LÓGICA DEL MODAL ---
    const openModalForNew = (periodId) => {
        currentlyEditing = { periodId, unitId: null };
        unitModalTitle.textContent = 'Añadir Nueva Unidad';
        addUnitBtn.textContent = 'Añadir Unidad';
        document.getElementById('unit-title').value = '';
        document.getElementById('unit-start-date').value = '';
        document.getElementById('unit-end-date').value = '';
        document.getElementById('unit-situacion').value = '';
        document.getElementById('unit-producto').value = '';

        populateCompetenciesChecklist(areaSelect.value); // Se sigue llamando aquí

        competenciesChecklist.querySelectorAll('input').forEach(c => c.checked = false);
        unitDetailsFieldset.disabled = true;
        unitModal.classList.remove('hidden');
    };

    const openModalForEdit = (periodId, unitId) => {
        const unit = unitsData[periodId]?.find(u => u.id === unitId);
        if (!unit) return;
        currentlyEditing = { periodId, unitId };
        unitModalTitle.textContent = 'Editar Unidad';
        addUnitBtn.textContent = 'Guardar Cambios';
        document.getElementById('unit-title').value = unit.title;
        document.getElementById('unit-start-date').value = unit.startDate;
        document.getElementById('unit-end-date').value = unit.endDate;
        document.getElementById('unit-situacion').value = unit.situacion;
        document.getElementById('unit-producto').value = unit.producto;

        populateCompetenciesChecklist(areaSelect.value); // Se sigue llamando aquí
        competenciesChecklist.querySelectorAll('input').forEach(cb => {
            cb.checked = unit.competencias.includes(cb.value);
        });
        unitDetailsFieldset.disabled = false;
        unitModal.classList.remove('hidden');
    };

    addUnitBtn.addEventListener('click', () => {
        const { periodId, unitId } = currentlyEditing;
        if (!periodId) return;
        const unitData = {
            title: document.getElementById('unit-title').value.trim(),
            startDate: document.getElementById('unit-start-date').value,
            endDate: document.getElementById('unit-end-date').value,
            situacion: document.getElementById('unit-situacion').value,
            producto: document.getElementById('unit-producto').value,
            competencias: Array.from(competenciesChecklist.querySelectorAll('input:checked')).map(cb => cb.value)
        };
        if (!unitData.title) return alert('El título de la unidad es obligatorio.');

        if (unitId) { // Editando
            const unitIndex = unitsData[periodId].findIndex(u => u.id === unitId);
            if (unitIndex > -1) unitsData[periodId][unitIndex] = { ...unitsData[periodId][unitIndex], ...unitData };
        } else { // Creando
            unitsData[periodId].push({ id: `unit-${Date.now()}`, ...unitData });
        }
        renderUnitsForPeriod(periodId);
        unitModal.classList.add('hidden');
    });

    organizationContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const { periodId, unitId } = button.dataset;

        if (button.classList.contains('add-new-unit-btn')) {
            openModalForNew(periodId);
        }
        else if (button.classList.contains('edit-unit-btn')) {
            openModalForEdit(periodId, unitId);
        }
        else if (button.classList.contains('delete-unit-btn')) {
            if (confirm('¿Estás seguro de que deseas eliminar esta unidad?')) {
                unitsData[periodId] = unitsData[periodId].filter(u => u.id !== unitId);
                renderUnitsForPeriod(periodId);
            }
        }
    });

    cancelUnitBtn.addEventListener('click', () => unitModal.classList.add('hidden'));
    competenciesChecklist.addEventListener('change', () => { unitDetailsFieldset.disabled = !competenciesChecklist.querySelector('input:checked'); });


    // --- 7. LÓGICA DE IA ---
    const getAISuggestion = async (prompt, button) => {
        const loader = button.querySelector('.loader');
        const buttonText = button.querySelector('span');
        loader.style.display = 'inline-block';
        if (buttonText) buttonText.style.display = 'none';
        button.disabled = true;
        try {
            const response = await fetch('/.netlify/functions/generate-text', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }),
            });
            if (!response.ok) throw new Error(`Error de la API: ${response.statusText}`);
            return (await response.json()).suggestion;
        } catch (error) {
            console.error("Error al obtener sugerencia de IA:", error);
            alert("No se pudo obtener la sugerencia. Verifica tu conexión y la clave API en el archivo .env.");
            return '';
        } finally {
            loader.style.display = 'none';
            if (buttonText) buttonText.style.display = 'inline-block';
            button.disabled = false;
        }
    };

    suggestJustificacionBtn.addEventListener('click', async () => {
        const prompt = `Como pedagogo experto del Currículo Nacional peruano, redacta una justificación concisa (máximo 120 palabras) para una planificación anual de ${areaSelect.value} para ${gradeSelect.value}. Basa tu redacción en este contexto estudiantil: "${document.getElementById('info-realidad').value || 'un contexto general urbano'}".`;
        const suggestion = await getAISuggestion(prompt, suggestJustificacionBtn);
        if (suggestion) document.getElementById('desc-justificacion').value = suggestion.trim();
    });

    suggestPerfilBtn.addEventListener('click', async () => {
        const prompt = `Como experto en el CNEB de Perú, describe en un párrafo (máximo 100 palabras) el perfil de egreso esperado para un estudiante que culmina el ${gradeSelect.value} en el área de ${areaSelect.value}.`;
        const suggestion = await getAISuggestion(prompt, suggestPerfilBtn);
        if (suggestion) document.getElementById('desc-perfil').value = suggestion.trim();
    });

    suggestUnitTitleBtn.addEventListener('click', async () => {
        const prompt = `Sugiere 5 títulos creativos y cortos para una unidad de aprendizaje del área de ${areaSelect.value} para ${gradeSelect.value}. Devuelve solo la lista de títulos.`;
        const suggestion = await getAISuggestion(prompt, suggestUnitTitleBtn);
        if (suggestion) document.getElementById('unit-title').value = suggestion.split('\n')[0].replace(/^\d+\.\s*/, '').trim();
    });

    suggestUnitSituacionBtn.addEventListener('click', async () => {
        const prompt = `Para una unidad de aprendizaje de ${areaSelect.value} para ${gradeSelect.value} titulada "${document.getElementById('unit-title').value || "la unidad actual"}", redacta una situación significativa breve (máximo 150 palabras) que plantee un reto del contexto.`;
        const suggestion = await getAISuggestion(prompt, suggestUnitSituacionBtn);
        if (suggestion) document.getElementById('unit-situacion').value = suggestion.trim();
    });

    suggestUnitProductoBtn.addEventListener('click', async () => {
        const prompt = `Basado en la siguiente situación significativa: "${document.getElementById('unit-situacion').value || 'una situación relacionada con el área de ' + areaSelect.value}", sugiere un producto o actuación integrador y tangible. Sé breve y directo.`;
        const suggestion = await getAISuggestion(prompt, suggestUnitProductoBtn);
        if (suggestion) document.getElementById('unit-producto').value = suggestion.trim();
    });

    suggestEvalDiagnosticaBtn.addEventListener('click', async () => {
        const prompt = `Como experto en evaluación del Currículo Nacional peruano para el área de ${areaSelect.value} y grado ${gradeSelect.value}, redacta una breve descripción sobre la evaluación diagnóstica en el contexto de una planificación anual. Considera los saberes previos y necesidades de los estudiantes. (Máximo 100 palabras).`;
        const suggestion = await getAISuggestion(prompt, suggestEvalDiagnosticaBtn);
        if (suggestion) document.getElementById('eval-diagnostica').value = suggestion.trim();
    });

    suggestEvalFormativaBtn.addEventListener('click', async () => {
        const prompt = `Como experto en evaluación del Currículo Nacional peruano para el área de ${areaSelect.value} y grado ${gradeSelect.value}, redacta una breve descripción sobre cómo se realizará la evaluación formativa a lo largo del año. Incluye técnicas e instrumentos generales. (Máximo 120 palabras).`;
        const suggestion = await getAISuggestion(prompt, suggestEvalFormativaBtn);
        if (suggestion) document.getElementById('eval-formativa').value = suggestion.trim();
    });

    suggestEvalSumativaBtn.addEventListener('click', async () => {
        const prompt = `Como experto en evaluación del Currículo Nacional peruano para el área de ${areaSelect.value} y grado ${gradeSelect.value}, redacta una breve descripción sobre la evaluación sumativa al final de los periodos. (Máximo 100 palabras).`;
        const suggestion = await getAISuggestion(prompt, suggestEvalSumativaBtn);
        if (suggestion) document.getElementById('eval-sumativa').value = suggestion.trim();
    });

    suggestRecursosDocenteBtn.addEventListener('click', async () => {
        const prompt = `Sugiere una lista de 5-7 recursos o materiales pedagógicos que un docente del área de ${areaSelect.value} para ${gradeSelect.value} de secundaria podría utilizar en su práctica. Sé conciso, solo la lista.`;
        const suggestion = await getAISuggestion(prompt, suggestRecursosDocenteBtn);
        if (suggestion) document.getElementById('recursos-docente').value = suggestion.trim();
    });

    suggestRecursosEstudianteBtn.addEventListener('click', async () => {
        const prompt = `Sugiere una lista de 5-7 recursos o materiales que los estudiantes de ${gradeSelect.value} de secundaria, en el área de ${areaSelect.value}, podrían utilizar para su aprendizaje. Sé conciso, solo la lista.`;
        const suggestion = await getAISuggestion(prompt, suggestRecursosEstudianteBtn);
        if (suggestion) document.getElementById('recursos-estudiante').value = suggestion.trim();
    });

    // --- LÓGICA DE VISTA PREVIA ---
    generatePreviewBtn.addEventListener('click', () => {
        fullFormData = {
            infoNivel: levelSelect.value,
            infoGrado: gradeSelect.value,
            infoArea: areaSelect.value,
            infoIe: document.getElementById('info-ie').value,
            infoDirector: document.getElementById('info-director').value,
            infoSubdirector: document.getElementById('info-subdirector').value,
            infoDocente: document.getElementById('info-docente').value,
            infoAno: document.getElementById('info-ano').value,
            infoRealidad: document.getElementById('info-realidad').value,
            descJustificacion: document.getElementById('desc-justificacion').value,
            descPerfil: document.getElementById('desc-perfil').value,
            evalDiagnostica: document.getElementById('eval-diagnostica').value,
            evalFormativa: document.getElementById('eval-formativa').value,
            evalSumativa: document.getElementById('eval-sumativa').value,
            recursosDocente: document.getElementById('recursos-docente').value,
            recursosEstudiante: document.getElementById('recursos-estudiante').value,
            enfoquesTransversales: Array.from(document.querySelectorAll('input[name="enfoqueTransversal"]:checked'))
                                    .map(cb => {
                                        const enfoqueKey = cb.value;
                                        return {
                                            name: enfoqueKey,
                                            details: enfoquesTransversales[enfoqueKey]
                                        };
                                    }),
            unitsData: unitsData,
            competenciasArea: competenciasPorArea[areaSelect.value] || {}
        };

        renderPreview(fullFormData);
        showStep(8);
    });

    const renderPreview = (data) => {
        let htmlContent = `<h1 class="text-2xl font-bold text-center mb-2">“AÑO DE LA RECUPERACIÓN Y CONSOLIDACIÓN DE LA ECONOMÍA PERUANA”</h1>`;
        htmlContent += `<h1 class="text-2xl font-bold text-center mb-6">PLANIFICACIÓN CURRICULAR ANUAL ${data.infoAno}</h1>`;


        htmlContent += `<h2 class="text-xl font-semibold mt-6 mb-3">I. DATOS INFORMATIVOS</h2>`;
        htmlContent += `<p class="text-gray-500 text-sm mb-2">Información general de la institución y el plan.</p>`;
        htmlContent += `<table class="min-w-full bg-white border border-gray-300">`;
        htmlContent += `<tr style="background-color: #DDEBF7;"><td class="py-2 px-3 border-b" style="font-weight: bold; text-transform: uppercase;">Institución Educativa:</td><td class="py-2 px-3 border-b">${data.infoIe}</td></tr>`;
        htmlContent += `<tr style="background-color: #DDEBF7;"><td class="py-2 px-3 border-b" style="font-weight: bold; text-transform: uppercase;">Director(a):</td><td class="py-2 px-3 border-b">${data.infoDirector}</td></tr>`;
        htmlContent += `<tr style="background-color: #DDEBF7;"><td class="py-2 px-3 border-b" style="font-weight: bold; text-transform: uppercase;">Subdirector(a):</td><td class="py-2 px-3 border-b">${data.infoSubdirector}</td></tr>`;
        htmlContent += `<tr style="background-color: #DDEBF7;"><td class="py-2 px-3 border-b" style="font-weight: bold; text-transform: uppercase;">Nivel:</td><td class="py-2 px-3 border-b">${data.infoNivel}</td></tr>`;
        htmlContent += `<tr style="background-color: #DDEBF7;"><td class="py-2 px-3 border-b" style="font-weight: bold; text-transform: uppercase;">Área:</td><td class="py-2 px-3 border-b">${data.infoArea}</td></tr>`;
        htmlContent += `<tr style="background-color: #DDEBF7;"><td class="py-2 px-3 border-b" style="font-weight: bold; text-transform: uppercase;">Grado:</td><td class="py-2 px-3 border-b">${data.infoGrado}</td></tr>`;
        htmlContent += `<tr style="background-color: #DDEBF7;"><td class="py-2 px-3 border-b" style="font-weight: bold; text-transform: uppercase;">Docente Responsable:</td><td class="py-2 px-3 border-b">${data.infoDocente}</td></tr>`;
        htmlContent += `<tr style="background-color: #DDEBF7;"><td class="py-2 px-3 border-b" style="font-weight: bold; text-transform: uppercase;">Año Lectivo:</td><td class="py-2 px-3 border-b">${data.infoAno}</td></tr>`;
        htmlContent += `<tr style="background-color: #DDEBF7;"><td class="py-2 px-3 border-b" style="font-weight: bold; text-transform: uppercase;">Realidad de la Localidad (Contexto):</td><td class="py-2 px-3 border-b">${data.infoRealidad || 'No especificado.'}</td></tr>`;
        htmlContent += `</table>`;

        htmlContent += `<h2 class="text-xl font-semibold mt-6 mb-3">II. JUSTIFICACIÓN Y PERFIL DE EGRESO</h2>`;
        htmlContent += `<p class="mb-2"><strong>Justificación (Necesidades de Aprendizaje):</strong></p>`;
        htmlContent += `<p class="mb-4">${data.descJustificacion || 'El docente no describió la justificación.'}</p>`;
        htmlContent += `<p class="mb-2"><strong>Perfil de Egreso:</strong></p>`;
        htmlContent += `<p class="mb-4">${data.descPerfil || 'El docente no describió el perfil de egreso.'}</p>`;


        // Renderizar Organización y Calendarización
        htmlContent += `<h2 class="text-xl font-semibold mt-6 mb-3">III. ORGANIZACIÓN Y CALENDARIZACIÓN</h2>`;
        htmlContent += `<p class="text-gray-500 text-sm mb-2">Detalle de las unidades de aprendizaje planificadas por periodo.</p>`;

        htmlContent += `<div class="text-center p-4 border-2 border-dashed border-gray-300 my-6">
                            <p class="text-gray-600">____________________________________________________________________________________</p>
                            <p class="text-gray-600">Espacio para insertar la imagen de la calendarización anual (ej. horario, diagrama de Gantt)</p>
                            <p class="text-gray-600">____________________________________________________________________________________</p>
                            <p class="text-gray-500 text-xs mt-2">(Pegue aquí la imagen de su calendarización)</p>
                        </div>`;


        for (const periodId in data.unitsData) {
            if (data.unitsData.hasOwnProperty(periodId)) {
                const periodUnits = data.unitsData[periodId];
                const periodTitle = periodId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                htmlContent += `<h3 class="text-lg font-bold mt-4 mb-2">${periodTitle}</h3>`;
                if (periodUnits.length === 0) {
                    htmlContent += `<p class="text-gray-600 mb-2">No hay unidades definidas para este periodo.</p>`;
                } else {
                    periodUnits.forEach(unit => {
                        const startDate = unit.startDate ? new Date(unit.startDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                        const endDate = unit.endDate ? new Date(unit.endDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

                        htmlContent += `<table class="min-w-full bg-white border border-gray-300 mb-4">
                                            <thead>
                                                <tr>
                                                    <th colspan="2" class="py-2 px-3 text-left font-bold text-white" style="background-color: #4472C4;">Unidad: ${unit.title}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr><td class="py-2 px-3 border-b font-semibold" style="width: 30%;">Duración:</td><td class="py-2 px-3 border-b">${startDate} al ${endDate}</td></tr>
                                                <tr><td class="py-2 px-3 border-b font-semibold" style="width: 30%;">Situación Significativa:</td><td class="py-2 px-3 border-b">${unit.situacion || 'No especificado.'}</td></tr>
                                                <tr><td class="py-2 px-3 border-b font-semibold" style="width: 30%;">Producto Integrador:</td><td class="py-2 px-3 border-b">${unit.producto || 'No especificado.'}</td></tr>
                                                <tr><td class="py-2 px-3 border-b font-semibold" style="width: 30%;">Competencias Asociadas:</td><td class="py-2 px-3 border-b">${unit.competencias.map(c => competenciasPorArea[data.infoArea][c]?.nombre || c).join(', ') || 'No se seleccionaron competencias.'}</td></tr>
                                            </tbody>
                                        </table>`;
                    });
                }
            }
        }


        // Renderizar Enfoques Transversales
        htmlContent += `<h2 class="text-xl font-semibold mt-6 mb-3">IV. ENFOQUES TRANSVERSALES</h2>`;
        htmlContent += `<p class="text-gray-500 text-sm mb-2">Enfoques que guiarán la labor pedagógica durante el año.</p>`;
        if (data.enfoquesTransversales && data.enfoquesTransversales.length > 0) {
            htmlContent += `<table class="min-w-full bg-white border border-gray-300">
                                <thead>
                                    <tr>
                                        <th class="py-2 px-3 border-b text-left font-bold text-white" style="background-color: #4472C4;">Enfoque</th>
                                        <th class="py-2 px-3 border-b text-left font-bold text-white" style="background-color: #4472C4;">Valores y Descripciones</th>
                                    </tr>
                                </thead>
                                <tbody>`;
            data.enfoquesTransversales.forEach(enfoque => {
                const enfoqueTitle = enfoque.name.replace(/\b\w/g, l => l.toUpperCase());
                let valuesList = '';
                for (const valueKey in enfoque.details) {
                    if (enfoque.details.hasOwnProperty(valueKey)) {
                        valuesList += `<strong>${valueKey}:</strong> ${enfoque.details[valueKey]}<br>`;
                    }
                }
                htmlContent += `<tr>
                                    <td class="py-2 px-3 border-b">${enfoqueTitle}</td>
                                    <td class="py-2 px-3 border-b">${valuesList}</td>
                                </tr>`;
            });
            htmlContent += `</tbody></table>`;
        } else {
            htmlContent += `<p>No se seleccionaron enfoques transversales.</p>`;
        }

        // Renderizar Competencias y Capacidades (todas las del área, marcando las usadas)
        htmlContent += `<h2 class="text-xl font-semibold mt-6 mb-3">V. COMPETENCIAS Y CAPACIDADES DEL ÁREA</h2>`;
        const selectedAreaCompetencies = data.competenciasArea;
        if (Object.keys(selectedAreaCompetencies).length > 0) {
            htmlContent += `<p class="mb-2 text-sm text-gray-700">Las competencias marcadas con <span class="font-bold text-blue-600"> (✅)</span> indican su uso en las unidades.</p>`;
            htmlContent += `<table class="min-w-full bg-white border border-gray-300 mb-6">
                                <thead>
                                    <tr>
                                        <th class="py-2 px-3 border-b text-left font-bold text-white" style="background-color: #4472C4; width: 22%;">Competencia</th>
                                        <th class="py-2 px-3 border-b text-left font-bold text-white" style="background-color: #4472C4; width: 8%;">Uso</th>
                                        <th class="py-2 px-3 border-b text-left font-bold text-white" style="background-color: #4472C4; width: 30%;">Capacidades</th>
                                        <th class="py-2 px-3 border-b text-left font-bold text-white" style="background-color: #4472C4; width: 40%;">Desempeños del Grado</th>
                                    </tr>
                                </thead>
                                <tbody>`;

            const allSelectedCompetenciesInUnits = new Set();
            for (const periodId in data.unitsData) {
                if (data.unitsData.hasOwnProperty(periodId)) {
                    data.unitsData[periodId].forEach(unit => {
                        unit.competencias.forEach(compKey => allSelectedCompetenciesInUnits.add(compKey));
                    });
                }
            }

            for (const compKey in selectedAreaCompetencies) {
                if (selectedAreaCompetencies.hasOwnProperty(compKey)) {
                    const competencia = selectedAreaCompetencies[compKey];
                    const isUsedInUnits = allSelectedCompetenciesInUnits.has(compKey);
                    htmlContent += `<tr>
                                        <td class="py-2 px-3 border-b font-semibold">${competencia.nombre}</td>
                                        <td class="py-2 px-3 border-b text-center">${isUsedInUnits ? '<span style="color: #0000FF; font-weight: bold; font-size: 1.5em;">✅</span>' : ''}</td>
                                        <td class="py-2 px-3 border-b">
                                            <ul class="list-disc pl-5">`;
                    competencia.capacidades.forEach(capacidad => {
                        htmlContent += `<li>${capacidad}</li>`;
                    });
                    htmlContent += `           </ul>
                                        </td>
                                        <td class="py-2 px-3 border-b">${competencia.desempeño || 'Desempeño no especificado para este grado.'}</td>
                                    </tr>`;
                }
            }
            htmlContent += `</tbody></table>`;
        } else {
            htmlContent += `<p>No se encontraron competencias para el área seleccionada.</p>`;
        }


        htmlContent += `<h2 class="text-xl font-semibold mt-6 mb-3">VI. EVALUACIÓN</h2>`;
        htmlContent += `<p class="text-gray-500 text-sm mb-2">Criterios y momentos de evaluación para el proceso de enseñanza-aprendizaje.</p>`;
        htmlContent += `<p class="mb-2"><strong>Orientaciones para la Evaluación Diagnóstica:</strong></p>`;
        htmlContent += `<p class="mb-4">${data.evalDiagnostica || 'No se especificaron orientaciones.'}</p>`;
        htmlContent += `<p class="mb-2"><strong>Orientaciones para la Evaluación Formativa:</strong></p>`;
        htmlContent += `<p class="mb-4">${data.evalFormativa || 'No se especificaron orientaciones.'}</p>`;
        htmlContent += `<p class="mb-2"><strong>Orientaciones para la Evaluación Sumativa:</strong></p>`;
        htmlContent += `<p class="mb-4">${data.evalSumativa || 'No se especificaron orientaciones.'}</p>`;

        htmlContent += `<h2 class="text-xl font-semibold mt-6 mb-3">VII. MATERIALES Y RECURSOS</h2>`;
        htmlContent += `<p class="text-gray-500 text-sm mb-2">Recursos didácticos y materiales necesarios para docentes y estudiantes.</p>`;
        htmlContent += `<p class="mb-2"><strong>Para el Docente:</strong></p><ul class="list-decimal pl-5 mb-4">`;
        if (data.recursosDocente) {
            data.recursosDocente.split(/\d+\.\s*/).filter(item => item.trim() !== '').forEach(item => {
                htmlContent += `<li>${item.trim()}</li>`;
            });
        } else {
            htmlContent += `<li>No se especificaron recursos.</li>`;
        }
        htmlContent += `</ul>`;
        htmlContent += `<p class="mb-2"><strong>Para el Estudiante:</strong></p><ul class="list-decimal pl-5 mb-4">`;
        if (data.recursosEstudiante) {
            data.recursosEstudiante.split(/\d+\.\s*/).filter(item => item.trim() !== '').forEach(item => {
                htmlContent += `<li>${item.trim()}</li>`;
            });
        } else {
            htmlContent += `<li>No se especificaron recursos.</li>`;
        }
        htmlContent += `</ul>`;

        // Campo de Firmas al final para la vista previa
        htmlContent += `<div class="mt-20 flex justify-around">
                            <div class="text-center">
                                <p>____________________________________</p>
                                <p class="font-bold">${data.infoDocente || 'Nombre del Docente'}</p>
                                <p>Docente Responsable</p>
                            </div>
                            <div class="text-center">
                                <p>____________________________________</p>
                                <p class="font-bold">${data.infoDirector || 'Nombre del Director(a)'}</p>
                                <p>Director(a)</p>
                            </div>
                        </div>`;


        previewContent.innerHTML = htmlContent;
    };

    // --- LÓGICA DE DESCARGA (AHORA USA fullFormData) ---
    downloadWordBtn.addEventListener('click', async () => {
        if (Object.keys(fullFormData).length === 0) {
            alert("Por favor, primero genere la vista previa del documento.");
            return;
        }

        downloadWordBtn.textContent = 'Generando...';
        downloadWordBtn.disabled = true;

        try {
            const response = await fetch('/.netlify/functions/generate-word', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fullFormData)
            });
            if (!response.ok) throw new Error(`Error del servidor al generar Word: ${response.statusText}`);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `PAC-${fullFormData.infoArea.replace(/ /g, '_')}-${fullFormData.infoAno}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Error al generar el documento:', error);
            alert("No se pudo generar el documento. Revisa la consola para más detalles.");
        } finally {
            downloadWordBtn.textContent = 'Descargar .docx';
            downloadWordBtn.disabled = false;
        }
    });

    // --- 9. INICIALIZACIÓN ---
    const initializeApp = () => {
        populateLevels();
        populateGrades();
        populateEnfoquesTransversales();
        renderOrganizationPeriods();
        showStep(1);

        levelSelect.addEventListener('change', populateGrades);
        areaSelect.addEventListener('change', () => {
            if (!unitModal.classList.contains('hidden')) {
                populateCompetenciesChecklist(areaSelect.value);
                if (currentlyEditing.unitId) {
                    const periodId = currentlyEditing.periodId;
                    const unit = unitsData[periodId]?.find(u => u.id === currentlyEditing.unitId);
                    if (unit) {
                        competenciesChecklist.querySelectorAll('input').forEach(cb => {
                            cb.checked = unit.competencias.includes(cb.value);
                        });
                        unitDetailsFieldset.disabled = false;
                    }
                } else {
                    competenciesChecklist.querySelectorAll('input').forEach(c => c.checked = false);
                    unitDetailsFieldset.disabled = true;
                }
            }
        });
        periodDivisionSelect.addEventListener('change', renderOrganizationPeriods);
    };

    initializeApp();
});