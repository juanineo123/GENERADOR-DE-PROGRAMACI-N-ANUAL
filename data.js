// Este objeto define los grados disponibles para cada nivel educativo.
const nivelesYGrados = {
    "Inicial": ["3 años", "4 años", "5 años"],
    "Primaria": ["Primero", "Segundo", "Tercero", "Cuarto", "Quinto", "Sexto"],
    "Secundaria": ["Primero", "Segundo", "Tercero", "Cuarto", "Quinto"]
};

// Este objeto contiene las competencias, capacidades y un ejemplo de desempeño para cada área.
const competenciasPorArea = {
    "Arte y Cultura": {
        "AC1": {
            "nombre": "Aprecia de manera crítica manifestaciones artístico-culturales",
            "capacidades": [
                "Percibe manifestaciones artístico-culturales.",
                "Contextualiza manifestaciones artístico-culturales.",
                "Reflexiona creativa y críticamente sobre manifestaciones artístico-culturales."
            ],
            "desempeño": "Analiza las cualidades estéticas o comunicativas de manifestaciones artístico-culturales diversas, asociándolas a ideas, experiencias o sentimientos que transmiten y a su función simbólica."
        },
        "AC2": {
            "nombre": "Crea proyectos desde los lenguajes artísticos",
            "capacidades": [
                "Explora y experimenta los lenguajes artísticos.",
                "Aplica procesos de creación.",
                "Evalúa y comunica sus procesos y proyectos."
            ],
            "desempeño": "Planifica y desarrolla un proyecto artístico incorporando elementos de los lenguajes artísticos, procesos de creación y recursos tecnológicos, para expresar ideas, emociones o experiencias. Evalúa la pertinencia y eficacia de sus decisiones."
        }
    },
    "Ciencias Sociales": {
        "CS1": {
            "nombre": "Construye interpretaciones históricas",
            "capacidades": [
                "Interpreta críticamente fuentes diversas.",
                "Comprende el tiempo histórico.",
                "Elabora explicaciones sobre procesos históricos."
            ],
            "desempeño": "Contrasta diversas interpretaciones del pasado, a partir de la evaluación de fuentes complementarias, reconociendo el contexto en el que fueron producidas y explicando cómo las diferentes perspectivas contribuyen a una visión más compleja de los procesos históricos."
        },
        "CS2": {
            "nombre": "Gestiona responsablemente el espacio y el ambiente",
            "capacidades": [
                "Comprende las relaciones entre los elementos naturales y sociales.",
                "Maneja fuentes de información para comprender el espacio geográfico y el ambiente.",
                "Genera acciones para conservar el ambiente local y global."
            ],
            "desempeño": "Explica la influencia de los factores físicos y humanos en la configuración de espacios geográficos, analizando las causas y consecuencias de problemáticas ambientales y territoriales."
        },
        "CS3": {
            "nombre": "Gestiona responsablemente los recursos económicos",
            "capacidades": [
                "Comprende el funcionamiento del sistema económico y financiero.",
                "Toma decisiones económicas y financieras."
            ],
            "desempeño": "Explica las interrelaciones entre los agentes del sistema económico y financiero, sus operaciones y cómo el Estado interviene en la economía."
        }
    },
    "Comunicación": {
        "C1": {
            "nombre": "Se comunica oralmente en su lengua materna",
            "capacidades": [
                "Obtiene información del texto oral.",
                "Infiere e interpreta información del texto oral.",
                "Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada.",
                "Utiliza recursos no verbales y paraverbales de forma estratégica.",
                "Interactúa estratégicamente con distintos interlocutores.",
                "Reflexiona y evalúa la forma, el contenido y contexto del texto oral."
            ],
            "desempeño": "Expresa oralmente ideas y emociones de forma coherente y cohesionada, ajustándose a la situación comunicativa y al propósito, utilizando vocabulario variado y pertinente, con pronunciación inteligible, entonación adecuada y volumen pertinente."
        },
        "C2": {
            "nombre": "Lee diversos tipos de textos escritos en su lengua materna",
            "capacidades": [
                "Obtiene información del texto escrito.",
                "Infiere e interpreta información del texto escrito.",
                "Reflexiona y evalúa la forma, el contenido y contexto del texto escrito."
            ],
            "desempeño": "Identifica información explícita, relevante y complementaria, distinguiendo detalles, causas, características y consecuencias de eventos o hechos en textos con estructura compleja."
        },
        "C3": {
            "nombre": "Escribe diversos tipos de textos en su lengua materna",
            "capacidades": [
                "Adecúa el texto a la situación comunicativa.",
                "Organiza y desarrolla las ideas de forma coherente y cohesionada.",
                "Utiliza convenciones del lenguaje escrito de forma pertinente.",
                "Reflexiona y evalúa la forma, el contenido y contexto del texto escrito."
            ],
            "desempeño": "Escribe textos de forma coherente y cohesionada, organizando sus ideas en torno a un tema, utilizando vocabulario variado y pertinente, conectores y referentes, así como recursos ortográficos y gramaticales complejos para dar claridad y sentido."
        }
    },
    "DPCC": {
        "DPCC1": {
            "nombre": "Construye su identidad",
            "capacidades": [
                "Se valora a sí mismo.",
                "Autorregula sus emociones.",
                "Reflexiona y argumenta éticamente.",
                "Vive su sexualidad de manera integral y responsable."
            ],
            "desempeño": "Sustenta una postura ética ante situaciones de conflicto moral, considerando principios éticos y derechos humanos, y asumiendo las consecuencias de sus decisiones."
        },
        "DPCC2": {
            "nombre": "Convive y participa democráticamente en la búsqueda del bien común",
            "capacidades": [
                "Interactúa con todas las personas.",
                "Construye normas y asume acuerdos y leyes.",
                "Maneja conflictos de manera constructiva.",
                "Delibera sobre asuntos públicos.",
                "Participa en acciones que promueven el bienestar común."
            ],
            "desempeño": "Establece relaciones interpersonales basadas en el respeto a las diferencias y la inclusión, valorando la diversidad cultural y el diálogo intercultural como fuente de enriquecimiento."
        }
    },
    "Educación Física": {
        "EF1": {
            "nombre": "Se desenvuelve de manera autónoma a través de su motricidad",
            "capacidades": [
                "Comprende su cuerpo.",
                "Se expresa corporalmente."
            ],
            "desempeño": "Adapta sus habilidades motrices básicas y específicas a situaciones diversas, aplicando principios biomecánicos y estrategias de juego para resolver desafíos motores, individuales y grupales."
        },
        "EF2": {
            "nombre": "Asume una vida saludable",
            "capacidades": [
                "Comprende las relaciones entre la actividad física, alimentación, postura e higiene personal y del ambiente, y la salud.",
                "Incorpora prácticas que mejoran su calidad de vida."
            ],
            "desempeño": "Explica la importancia de mantener una vida activa y saludable, comprendiendo los efectos de la alimentación, el ejercicio físico y los hábitos de higiene en su bienestar personal y social."
        },
        "EF3": {
            "nombre": "Interactúa a través de sus habilidades sociomotrices",
            "capacidades": [
                "Se relaciona utilizando sus habilidades sociomotrices.",
                "Crea y aplica estrategias y tácticas de juego."
            ],
            "desempeño": "Participa en diversas actividades físicas y deportivas, asumiendo roles y responsabilidades de liderazgo y colaboración, para lograr objetivos comunes, respetando reglas y mostrando fair play."
        }
    },
    "Educación Religiosa": {
        "ER1": {
            "nombre": "Construye su identidad como persona humana, amada por Dios, digna, libre y trascendente, comprendiendo la doctrina de su propia religión, abierto al diálogo con las que le son cercanas",
            "capacidades": [
                "Conoce y comprende la dimensión espiritual y religiosa.",
                "Asume la experiencia religiosa desde su identidad."
            ],
            "desempeño": "Comprende el mensaje de la Buena Nueva y su relación con el Plan de Salvación, identificando las enseñanzas de Jesús y de la Iglesia, y asumiéndolas en su vida personal y comunitaria."
        },
        "ER2": {
            "nombre": "Asume la experiencia del encuentro personal y comunitario con Dios en su proyecto de vida en coherencia con su creencia religiosa",
            "capacidades": [
                "Transforma su entorno desde el encuentro personal y comunitario con Dios y desde la fe.",
                "Actúa coherentemente en razón de su fe según los principios de su conciencia moral en situaciones concretas de la vida."
            ],
            "desempeño": "Interioriza el mensaje de las Sagradas Escrituras y la Tradición, aplicándolo a su vida cotidiana y proponiendo acciones de cambio a favor de un mundo más justo y solidario."
        }
    },
    "Inglés": {
        "IN1": {
            "nombre": "Se comunica oralmente en inglés como lengua extranjera",
            "capacidades": [
                "Obtiene información del texto oral.",
                "Infiere e interpreta información del texto oral.",
                "Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada.",
                "Utiliza recursos no verbales y paraverbales de forma estratégica.",
                "Interactúa estratégicamente con distintos interlocutores.",
                "Reflexiona y evalúa la forma, el contenido y contexto del texto oral."
            ],
            "desempeño": "Expresa oralmente ideas y emociones de forma coherente y cohesionada en inglés, ajustándose a la situación comunicativa y al propósito, utilizando vocabulario y expresiones apropiadas, con pronunciación clara y entonación adecuada."
        },
        "IN2": {
            "nombre": "Lee diversos tipos de textos escritos en inglés como lengua extranjera",
            "capacidades": [
                "Obtiene información del texto escrito.",
                "Infiere e interpreta información del texto escrito.",
                "Reflexiona y evalúa la forma, el contenido y contexto del texto escrito."
            ],
            "desempeño": "Identifica información explícita, relevante y complementaria en diversos tipos de textos escritos en inglés, con estructura compleja y vocabulario variado, deduciendo el significado de palabras y frases por el contexto."
        },
        "IN3": {
            "nombre": "Escribe diversos tipos de textos en inglés como lengua extranjera",
            "capacidades": [
                "Adecúa el texto a la situación comunicativa.",
                "Organiza y desarrolla las ideas de forma coherente y cohesionada.",
                "Utiliza convenciones del lenguaje escrito de forma pertinente.",
                "Reflexiona y evalúa la forma, el contenido y contexto del texto escrito."
            ],
            "desempeño": "Escribe textos en inglés de forma coherente y cohesionada, organizando sus ideas en torno a un tema, utilizando vocabulario variado y pertinente, conectores y referentes, así como recursos ortográficos y gramaticales complejos para dar claridad y sentido."
        }
    },
    "Matemática": {
        "M1": {
            "nombre": "Resuelve problemas de cantidad",
            "capacidades": [
                "Traduce cantidades a expresiones numéricas.",
                "Comunica su comprensión sobre los números y las operaciones.",
                "Usa estrategias y procedimientos de estimación y cálculo.",
                "Argumenta afirmaciones sobre las relaciones numéricas y las operaciones."
            ],
            "desempeño": "Plantea afirmaciones sobre las propiedades de las operaciones con números racionales, las regularidades en sus propiedades y las justifica con ejemplos y contraejemplos, reconociendo errores en las justificaciones."
        },
        "M2": {
            "nombre": "Resuelve problemas de regularidad, equivalencia y cambio",
            "capacidades": [
                "Traduce datos y condiciones a expresiones algebraicas y gráficas.",
                "Comunica su comprensión sobre las relaciones algebraicas.",
                "Usa estrategias y procedimientos para encontrar equivalencias y reglas generales.",
                "Argumenta afirmaciones sobre relaciones de cambio y equivalencia."
            ],
            "desempeño": "Plantea afirmaciones sobre las propiedades de las funciones lineales y afines, y las justifica con ejemplos y contraejemplos, reconociendo errores en las justificaciones."
        },
        "M3": {
            "nombre": "Resuelve problemas de forma, movimiento y localización",
            "capacidades": [
                "Modela objetos con formas geométricas y sus transformaciones.",
                "Comunica su comprensión sobre las formas y relaciones geométricas.",
                "Usa estrategias y procedimientos para medir y orientarse en el espacio.",
                "Argumenta afirmaciones sobre relaciones geométricas."
            ],
            "desempeño": "Plantea afirmaciones sobre las propiedades de las formas geométricas, y las justifica con ejemplos y contraejemplos, reconociendo errores en las justificaciones."
        },
        "M4": {
            "nombre": "Resuelve problemas de gestión de datos e incertidumbre",
            "capacidades": [
                "Representa datos con gráficos y medidas estadísticas o probabilísticas.",
                "Comunica su comprensión de los conceptos estadísticos y probabilísticos.",
                "Usa estrategias y procedimientos para recopilar y procesar datos.",
                "Sustenta conclusiones o decisiones con base en la información obtenida."
            ],
            "desempeño": "Plantea afirmaciones o conclusiones sobre la información cualitativa y cuantitativa de una población, o la probabilidad de un evento, y las justifica usando la información obtenida y sus conocimientos estadísticos."
        }
    },
    "Ciencia y Tecnología": {
        "CT1": {
            "nombre": "Indaga mediante métodos científicos para construir conocimientos",
            "capacidades": [
                "Problematiza situaciones para hacer indagación.",
                "Diseña estrategias para hacer indagación.",
                "Genera y registra datos o información.",
                "Analiza datos e información.",
                "Evalúa y comunica el proceso y resultados de su indagación."
            ],
            "desempeño": "Formula preguntas acerca de las variables que influyen en un hecho, fenómeno u objeto natural o tecnológico, y plantea hipótesis que las relacionan. Propone y explica un diseño de indagación para explorar, observar y manipular variables."
        },
        "CT2": {
            "nombre": "Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo",
            "capacidades": [
                "Comprende y usa conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo.",
                "Evalúa las implicancias del saber y del quehacer científico y tecnológico."
            ],
            "desempeño": "Explica la estructura y funciones de los sistemas biológicos, la conservación de la energía en diversos procesos, el origen de la vida y la evolución de las especies, basándose en evidencia científica."
        },
        "CT3": {
            "nombre": "Diseña y construye soluciones tecnológicas para resolver problemas de su entorno",
            "capacidades": [
                "Determina una alternativa de solución tecnológica.",
                "Diseña la alternativa de solución tecnológica.",
                "Implementa y valida la alternativa de solución tecnológica.",
                "Evalúa y comunica la eficiencia, la confiabilidad y los posibles impactos de su alternativa de solución tecnológica."
            ],
            "desempeño": "Propone alternativas de solución tecnológica a problemas de su entorno, con base en conocimientos científicos y prácticas locales, considerando las implicancias éticas, sociales y ambientales de su uso."
        }
    }
};

// Este objeto define los enfoques transversales y sus valores asociados.
const enfoquesTransversales = {
    "De derecho": {
        "Conciencia de derechos": "Disposición a conocer, reconocer y valorar los derechos individuales y colectivos que tenemos las personas en el ámbito privado y público.",
        "Libertad y responsabilidad": "Disposición a elegir de manera voluntaria y responsable la propia forma de actuar dentro de una sociedad, asumiendo las consecuencias.",
        "Diálogo y concertación": "Disposición a conversar con otras personas, intercambiando ideas o afectos de modo alternativo para construir juntos una postura común."
    },
    "Inclusivo": {
        "Respeto por las diferencias": "Reconocimiento al valor inherente de cada persona y de sus derechos, por encima de cualquier diferencia física, social o cultural.",
        "Equidad en la enseñanza": "Disposición a enseñar ofreciendo a los estudiantes las condiciones y oportunidades que cada uno necesita para lograr los mismos resultados.",
        "Confianza en la persona": "Disposición a depositar expectativas en una persona, creyendo sinceramente en su capacidad de superación y crecimiento."
    },
    "Intercultural": {
        "Respeto a la identidad cultural": "Reconocimiento al valor de las diversas identidades culturales y relaciones de pertenencia de los estudiantes para generar un diálogo equitativo.",
        "Justicia": "Disposición a actuar de manera justa, respetando el derecho de todos, exigiendo sus propios derechos y reconociendo derechos a quienes les corresponde.",
        "Diálogo intercultural": "Fomento de una interacción equitativa entre diversas culturas, mediante el diálogo y el respeto mutuo."
    },
    "Igualdad de Género": {
        "Igualdad y Dignidad": "Reconocimiento al valor inherente de hombres y mujeres, por encima de cualquier diferencia de género, para construir relaciones de equidad.",
        "Justicia": "Disposición a actuar de modo que se dé a cada quien lo que le corresponde, en especial a quienes se ven perjudicados por las desigualdades de género.",
        "Empatía": "Reconocer y transformar las diversas situaciones de desigualdad de género, evidenciando empatía con quienes las padecen."
    },
    "Ambiental": {
        "Solidaridad planetaria y equidad intergeneracional": "Disposición para colaborar con el bienestar y la calidad de vida de las generaciones presentes y futuras, así como con la naturaleza.",
        "Justicia y solidaridad": "Disposición a evaluar los impactos y costos ambientales de las acciones y actuar en beneficio de todas las personas y ecosistemas.",
        "Respeto a toda forma de vida": "Aprecio, valoración y disposición para el cuidado a toda forma de vida sobre la Tierra desde una mirada sistémica y global."
    },
    "Orientación al bien común": {
        "Equidad y justicia": "Disposición a reconocer que ante situaciones de inicio diferentes, se requieren compensaciones a aquellos con mayores dificultades.",
        "Solidaridad": "Disposición a apoyar incondicionalmente a personas en situaciones comprometidas o difíciles, demostrando un sentido de comunidad.",
        "Empatía": "Identificación afectiva con los sentimientos del otro y disposición para apoyar y comprender sus circunstancias.",
        "Responsabilidad": "Disposición a valorar y proteger los bienes comunes y compartidos de un colectivo, asumiendo las consecuencias de las propias acciones."
    },
    "Búsqueda de la Excelencia": {
        "Flexibilidad y apertura": "Disposición para adaptarse a los cambios, modificando si fuera necesario la propia conducta para alcanzar determinados objetivos.",
        "Superación personal": "Disposición a adquirir cualidades que mejorarán el propio desempeño y aumentarán el estado de satisfacción consigo mismo y con las circunstancias."
    }
};