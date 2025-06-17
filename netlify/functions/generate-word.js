// Importa las herramientas necesarias desde la librería 'docx'
const { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType, Table, TableCell, TableRow, WidthType, BorderStyle, Numbering, LevelFormat, Indent, ShadingType, VerticalAlign } = require('docx');

// Esta es la función principal que Netlify ejecutará
exports.handler = async function(event) {
    // 1. Recibir y decodificar los datos del formulario que vienen del frontend
    const data = JSON.parse(event.body);

    // Helper para obtener una nueva línea o espacio
    const breakParagraph = (spacingAfter = 120) => new Paragraph({ text: "", spacing: { after: spacingAfter } });

    // Función para convertir texto plano con numeración a párrafos con lista
    const createNumberedList = (text) => {
        if (!text) return [];
        const items = text.split(/\d+\.\s*/).filter(item => item.trim() !== '');
        return items.map((item) => new Paragraph({
            children: [new TextRun(item.trim())],
            numbering: {
                reference: "numbered-list",
                level: 0,
            },
            spacing: { after: 60 }
        }));
    };

    // Estilo de sombreado para las cabeceras de tabla
    const headerShading = {
        fill: "4472C4", // Azul más oscuro para cabeceras
        val: ShadingType.CLEAR,
        color: "auto",
    };

    // Estilo de sombreado para la primera columna de la tabla de datos informativos (color celeste bajito)
    const lightBlueShading = {
        fill: "DDEBF7", // Un color celeste muy claro
        val: ShadingType.CLEAR,
        color: "auto",
    };

    // 2. Crear un nuevo documento de Word en memoria
    const doc = new Document({
        // Definimos el creador del documento
        creator: "Generador PAC - J. M. Caicedo",
        description: "Planificación Curricular Anual para " + data.infoArea,
        title: "Planificación Curricular Anual",
        // Configuramos los estilos
        styles: {
            paragraphStyles: [{
                id: "Normal",
                name: "Normal",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    font: "Calibri",
                    size: 22, // 11pt
                },
                paragraph: {
                    spacing: { after: 160 }, // 8pt
                },
            }, {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    font: "Calibri",
                    size: 28, // 14pt
                    bold: true,
                },
                paragraph: {
                    spacing: { before: 240, after: 120 }, // 12pt before, 6pt after
                },
            },
            {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    font: "Calibri",
                    size: 24, // 12pt
                    bold: true,
                },
                paragraph: {
                    spacing: { before: 200, after: 100 },
                },
            },
            {
                id: "ListParagraph",
                name: "List Paragraph",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    font: "Calibri",
                    size: 22,
                },
                paragraph: {
                    spacing: { after: 60 },
                },
            }],
        },
        // Definimos la numeración para las listas
        numbering: {
            config: [{
                reference: "numbered-list",
                levels: [{
                    level: 0,
                    format: LevelFormat.DECIMAL,
                    text: "%1.",
                    alignment: AlignmentType.LEFT,
                    style: {
                        paragraph: {
                            indent: { left: 720, hanging: 360 },
                        },
                    },
                }],
            }],
        },
        // Contenido del documento
        sections: [{
            children: [
                // Nuevo párrafo con el nombre del año (tamaño 15pt y negritas)
                new Paragraph({
                    text: "“AÑO DE LA RECUPERACIÓN Y CONSOLIDACIÓN DE LA ECONOMÍA PERUANA”",
                    alignment: AlignmentType.CENTER,
                    run: {
                        bold: true,
                        size: 30, // 15pt (20 * 1.5 = 30)
                        font: "Calibri"
                    }
                }),
                breakParagraph(200), // Espacio después del nombre del año

                new Paragraph({
                    text: "PLANIFICACIÓN CURRICULAR ANUAL " + (data.infoAno || '2025'),
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                }),
                breakParagraph(300),

                new Paragraph({ text: "I. DATOS INFORMATIVOS", heading: HeadingLevel.HEADING_1 }),
                new Paragraph({ text: "Información general de la institución y el plan.", alignment: AlignmentType.LEFT, run: { color: "666666", size: 18 } }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({text: "INSTITUCIÓN EDUCATIVA", run: { bold: true, allCaps: true }})], shading: lightBlueShading }), new TableCell({ children: [new Paragraph(data.infoIe || '')], shading: lightBlueShading })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({text: "DIRECTOR(A)", run: { bold: true, allCaps: true }})], shading: lightBlueShading }), new TableCell({ children: [new Paragraph(data.infoDirector || '')], shading: lightBlueShading })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({text: "SUBDIRECTOR(A)", run: { bold: true, allCaps: true }})], shading: lightBlueShading }), new TableCell({ children: [new Paragraph(data.infoSubdirector || '')], shading: lightBlueShading })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({text: "NIVEL", run: { bold: true, allCaps: true }})], shading: lightBlueShading }), new TableCell({ children: [new Paragraph(data.infoNivel || '')], shading: lightBlueShading })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({text: "ÁREA", run: { bold: true, allCaps: true }})], shading: lightBlueShading }), new TableCell({ children: [new Paragraph(data.infoArea || '')], shading: lightBlueShading })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({text: "GRADO", run: { bold: true, allCaps: true }})], shading: lightBlueShading }), new TableCell({ children: [new Paragraph(data.infoGrado || '')], shading: lightBlueShading })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({text: "DOCENTE RESPONSABLE", run: { bold: true, allCaps: true }})], shading: lightBlueShading }), new TableCell({ children: [new Paragraph(data.infoDocente || '')], shading: lightBlueShading })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({text: "AÑO LECTIVO", run: { bold: true, allCaps: true }})], shading: lightBlueShading }), new TableCell({ children: [new Paragraph(data.infoAno || '')], shading: lightBlueShading })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({text: "REALIDAD DE LA LOCALIDAD (CONTEXTO)", run: { bold: true, allCaps: true }})], shading: lightBlueShading }), new TableCell({ children: [new Paragraph(data.infoRealidad || 'No especificado.')], shading: lightBlueShading })] }),
                    ],
                }),
                breakParagraph(),

                new Paragraph({ text: "II. JUSTIFICACIÓN, PERFIL DE EGRESO Y COMPETENCIAS DEL ÁREA", heading: HeadingLevel.HEADING_1 }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Justificación (Necesidades de Aprendizaje):", bold: true }),
                    ]
                }),
                new Paragraph(data.descJustificacion || 'El docente no describió la justificación.'),
                breakParagraph(),

                new Paragraph({
                    children: [
                        new TextRun({ text: "Perfil de Egreso:", bold: true }),
                    ]
                }),
                new Paragraph(data.descPerfil || 'El docente no describió el perfil de egreso.'),
                breakParagraph(),

                // Lógica para renderizar Competencias, Capacidades y Desempeños del Área
                ...(() => {
                    const compCapDesContent = [];
                    const selectedAreaCompetencies = data.competenciasArea;
                    const allSelectedCompetenciesInUnits = new Set();

                    // Recopilar todas las competencias seleccionadas en las unidades para marcarlas
                    for (const periodId in data.unitsData) {
                        if (data.unitsData.hasOwnProperty(periodId)) {
                            data.unitsData[periodId].forEach(unit => {
                                unit.competencias.forEach(compKey => allSelectedCompetenciesInUnits.add(compKey));
                            });
                        }
                    }

                    if (Object.keys(selectedAreaCompetencies).length > 0) {
                        compCapDesContent.push(new Paragraph({
                            children: [
                                new TextRun({ text: "Competencias, Capacidades y Desempeños del Área de ", bold: true }),
                                new TextRun({ text: data.infoArea, bold: true }),
                            ]
                        }));
                        compCapDesContent.push(new Paragraph({
                            children: [
                                new TextRun({ text: "Las competencias marcadas con ", font: "Calibri", size: 20 }),
                                new TextRun({ text: "(✅)", bold: true, color: "0000FF", font: "Calibri", size: 20 }),
                                new TextRun({ text: " indican su uso en las unidades.", font: "Calibri", size: 20 }),
                            ]
                        }));
                        compCapDesContent.push(breakParagraph());

                        compCapDesContent.push(new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph({ text: "COMPETENCIA", run: { bold: true, color: "FFFFFF" } })],
                                            verticalAlign: VerticalAlign.CENTER,
                                            width: { size: 22, type: WidthType.PERCENTAGE },
                                            shading: headerShading,
                                        }),
                                        new TableCell({
                                            children: [new Paragraph({ text: "USO", run: { bold: true, color: "FFFFFF" } })],
                                            verticalAlign: VerticalAlign.CENTER,
                                            width: { size: 8, type: WidthType.PERCENTAGE },
                                            shading: headerShading,
                                        }),
                                        new TableCell({
                                            children: [new Paragraph({ text: "CAPACIDADES", run: { bold: true, color: "FFFFFF" } })],
                                            verticalAlign: VerticalAlign.CENTER,
                                            width: { size: 30, type: WidthType.PERCENTAGE },
                                            shading: headerShading,
                                        }),
                                        new TableCell({
                                            children: [new Paragraph({ text: "DESEMPEÑOS DEL GRADO", run: { bold: true, color: "FFFFFF" } })],
                                            verticalAlign: VerticalAlign.CENTER,
                                            width: { size: 40, type: WidthType.PERCENTAGE },
                                            shading: headerShading,
                                        }),
                                    ],
                                    tableHeader: true,
                                    borders: {
                                        bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" }
                                    }
                                }),
                                ...Object.keys(selectedAreaCompetencies).map(compKey => {
                                    const competencia = selectedAreaCompetencies[compKey];
                                    const isUsedInUnits = allSelectedCompetenciesInUnits.has(compKey);

                                    const desempeñoTexto = competencia.desempeño || 'Desempeño no especificado para este grado.';

                                    return new TableRow({
                                        children: [
                                            new TableCell({
                                                children: [
                                                    new Paragraph({
                                                        children: [
                                                            new TextRun({ text: competencia.nombre, bold: true }),
                                                        ]
                                                    })
                                                ],
                                                verticalAlign: VerticalAlign.TOP
                                            }),
                                            new TableCell({
                                                children: [
                                                    new Paragraph({
                                                        children: [
                                                            ...(isUsedInUnits ? [new TextRun({ text: "✅", color: "0000FF", bold: true, size: 28 })] : [new TextRun({ text: "" })])
                                                        ],
                                                        alignment: AlignmentType.CENTER
                                                    })
                                                ],
                                                verticalAlign: VerticalAlign.TOP
                                            }),
                                            new TableCell({
                                                children: competencia.capacidades.map(capacidad =>
                                                    new Paragraph({
                                                        children: [new TextRun(`- ${capacidad}`)],
                                                        spacing: { after: 60 }
                                                    })
                                                ),
                                                verticalAlign: VerticalAlign.TOP
                                            }),
                                            new TableCell({
                                                children: [
                                                    new Paragraph({
                                                        text: desempeñoTexto,
                                                        spacing: { after: 60 }
                                                    })
                                                ],
                                                verticalAlign: VerticalAlign.TOP
                                            }),
                                        ],
                                        borders: {
                                            bottom: { style: BorderStyle.SINGLE, size: 6, color: "D3D3D3" }
                                        }
                                    });
                                }),
                            ],
                            borders: {
                                top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "D3D3D3" },
                                insideVertical: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                            },
                        }));
                    } else {
                        compCapDesContent.push(new Paragraph('No se encontraron competencias para el área seleccionada o no se enviaron datos de competencias.'));
                    }
                    return compCapDesContent;
                })(),
                breakParagraph(),


                new Paragraph({ text: "III. ORGANIZACIÓN Y CALENDARIZACIÓN DE UNIDADES DIDÁCTICAS", heading: HeadingLevel.HEADING_1 }),
                new Paragraph({ text: "Detalle de las unidades de aprendizaje planificadas por periodo.", alignment: AlignmentType.LEFT, run: { color: "666666", size: 18 } }),
                breakParagraph(),
                // Espacio para la imagen de calendarización anual
                new Paragraph({
                    children: [
                        new TextRun({ text: "____________________________________________________________________________________", break: 1 }),
                        new TextRun({ text: "  Espacio para insertar la imagen de la calendarización anual (ej. horario, diagrama de Gantt)  ", break: 1 }),
                        new TextRun({ text: "____________________________________________________________________________________", break: 1 }),
                        new TextRun({ text: "(Pegue aquí la imagen de su calendarización)", break: 1, color: "888888", size: 18 }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 100, after: 100 }
                }),
                breakParagraph(),


                // Lógica para renderizar Unidades Didácticas (ahora en formato de tabla por unidad)
                ...Object.keys(data.unitsData).map(periodId => {
                    const periodUnits = data.unitsData[periodId];
                    const periodTitle = periodId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const periodContent = [
                        new Paragraph({ text: periodTitle, heading: HeadingLevel.HEADING_2 }),
                    ];

                    if (periodUnits.length === 0) {
                        periodContent.push(new Paragraph('No hay unidades definidas para este periodo.'));
                    } else {
                        periodUnits.forEach(unit => {
                            const startDate = unit.startDate ? new Date(unit.startDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                            const endDate = unit.endDate ? new Date(unit.endDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

                            periodContent.push(new Table({
                                width: { size: 100, type: WidthType.PERCENTAGE },
                                borders: {
                                    top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                    bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                    left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                    right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                    insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "D3D3D3" },
                                    insideVertical: { style: BorderStyle.SINGLE, size: 6, color: "D3D3D3" },
                                },
                                rows: [
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                children: [new Paragraph({ text: `Unidad: ${unit.title}`, run: { bold: true, color: "FFFFFF" } })],
                                                columnSpan: 2,
                                                shading: headerShading,
                                            }),
                                        ],
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph({ text: "Duración:", bold: true })] }),
                                            new TableCell({ children: [new Paragraph(`${startDate} al ${endDate}`)] }),
                                        ],
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph({ text: "Situación Significativa:", bold: true })] }),
                                            new TableCell({ children: [new Paragraph(unit.situacion || 'No especificado.')] }),
                                        ],
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph({ text: "Producto Integrador:", bold: true })] }),
                                            new TableCell({ children: [new Paragraph(unit.producto || 'No especificado.')] }),
                                        ],
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph({ text: "Competencias Asociadas:", bold: true })] }),
                                            new TableCell({ children: [new Paragraph(unit.competencias.map(c => data.competenciasArea[c]?.nombre || c).join(', ') || 'No se seleccionaron competencias.')] }),
                                        ],
                                    }),
                                ],
                            }));
                            periodContent.push(breakParagraph(240));
                        });
                    }
                    return periodContent;
                }).flat(),
                breakParagraph(),


                new Paragraph({ text: "IV. ENFOQUES TRANSVERSALES", heading: HeadingLevel.HEADING_1 }),
                new Paragraph({ text: "Enfoques que guiarán la labor pedagógica durante el año.", alignment: AlignmentType.LEFT, run: { color: "666666", size: 18 } }),
                breakParagraph(),
                // Lógica para renderizar Enfoques Transversales
                ...(() => {
                    const enfoquesContent = [];
                    if (data.enfoquesTransversales && data.enfoquesTransversales.length > 0) {
                        enfoquesContent.push(new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph({ text: "Enfoque Transversal", run: { bold: true, color: "FFFFFF" } })],
                                            shading: headerShading
                                        }),
                                        new TableCell({
                                            children: [new Paragraph({ text: "Valores y Descripciones", run: { bold: true, color: "FFFFFF" } })],
                                            shading: headerShading
                                        }),
                                    ],
                                    tableHeader: true,
                                }),
                                ...data.enfoquesTransversales.map(enfoque => {
                                    const enfoqueTitle = enfoque.name.replace(/\b\w/g, l => l.toUpperCase());
                                    const values = Object.keys(enfoque.details).map(valueKey => {
                                        return new Paragraph({
                                            children: [
                                                new TextRun({ text: `${valueKey}: `, bold: true }),
                                                new TextRun({ text: enfoque.details[valueKey] })
                                            ],
                                            spacing: { after: 60 }
                                        });
                                    });
                                    return new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph(enfoqueTitle)] }),
                                            new TableCell({ children: values }),
                                        ],
                                    });
                                }),
                            ],
                             borders: {
                                top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                                insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "D3D3D3" },
                                insideVertical: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                            },
                        }));
                    } else {
                        enfoquesContent.push(new Paragraph('No se seleccionaron enfoques transversales.'));
                    }
                    return enfoquesContent;
                })(),
                breakParagraph(),


                new Paragraph({ text: "V. EVALUACIÓN", heading: HeadingLevel.HEADING_1 }),
                new Paragraph({ text: "Criterios y momentos de evaluación para el proceso de enseñanza-aprendizaje.", alignment: AlignmentType.LEFT, run: { color: "666666", size: 18 } }),
                breakParagraph(),
                new Paragraph({ children: [new TextRun({ text: "Orientaciones para la Evaluación Diagnóstica:", bold: true })] }),
                new Paragraph(data.evalDiagnostica || 'No se especificaron orientaciones.'),
                breakParagraph(),
                new Paragraph({ children: [new TextRun({ text: "Orientaciones para la Evaluación Formativa:", bold: true })] }),
                new Paragraph(data.evalFormativa || 'No se especificaron orientaciones.'),
                breakParagraph(),
                new Paragraph({ children: [new TextRun({ text: "Orientaciones para la Evaluación Sumativa:", bold: true })] }),
                new Paragraph(data.evalSumativa || 'No se especificaron orientaciones.'),
                breakParagraph(),

                new Paragraph({ text: "VI. MATERIALES Y RECURSOS", heading: HeadingLevel.HEADING_1 }),
                new Paragraph({ text: "Recursos didácticos y materiales necesarios para docentes y estudiantes.", alignment: AlignmentType.LEFT, run: { color: "666666", size: 18 } }),
                breakParagraph(),
                new Paragraph({ children: [new TextRun({ text: "Para el Docente:", bold: true })] }),
                ...createNumberedList(data.recursosDocente),
                breakParagraph(),
                new Paragraph({ children: [new TextRun({ text: "Para el Estudiante:", bold: true })] }),
                ...createNumberedList(data.recursosEstudiante),
                breakParagraph(),

                // Campo de Firmas al final
                breakParagraph(500),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE },
                        insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        breakParagraph(100),
                                        new Paragraph({
                                            text: "____________________________________",
                                            alignment: AlignmentType.CENTER,
                                            run: { size: 20 }
                                        }),
                                        new Paragraph({
                                            text: data.infoDocente || 'Nombre del Docente',
                                            alignment: AlignmentType.CENTER,
                                            run: { bold: true }
                                        }),
                                        new Paragraph({
                                            text: "Docente Responsable",
                                            alignment: AlignmentType.CENTER,
                                            run: { size: 20 }
                                        }),
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        breakParagraph(100),
                                        new Paragraph({
                                            text: "____________________________________",
                                            alignment: AlignmentType.CENTER,
                                            run: { size: 20 }
                                        }),
                                        new Paragraph({
                                            text: data.infoDirector || 'Nombre del Director(a)',
                                            alignment: AlignmentType.CENTER,
                                            run: { bold: true }
                                        }),
                                        new Paragraph({
                                            text: "Director(a)",
                                            alignment: AlignmentType.CENTER,
                                            run: { size: 20 }
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
                breakParagraph(200),
            ],
        }],
    });

    // 3. Empaquetar el documento en un 'buffer' (un formato binario)
    const buffer = await Packer.toBuffer(doc);

    // 4. Devolver el buffer como un archivo descargable
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": `attachment; filename="PAC-${data.infoArea.replace(/ /g, '_')}-${data.infoAno}.docx"`,
        },
        body: buffer.toString('base64'),
        isBase64Encoded: true,
    };
};