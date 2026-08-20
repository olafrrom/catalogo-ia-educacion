from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

if "name:'Typecast'" in text:
    print('Typecast already exists; no changes made.')
    raise SystemExit(0)

marker = "\n    const grid = document.getElementById('grid');"
marker_pos = text.find(marker)
if marker_pos == -1:
    raise SystemExit('Could not find insertion boundary before const grid.')

array_end = text.rfind('\n    ];', 0, marker_pos)
if array_end == -1:
    raise SystemExit('Could not find end of tools array.')

entry = """,
      {emoji:'🎙️',name:'Typecast',category:'Recursos sonoros',level:'Básico – Intermedio',url:'https://typecast.ai/',short:'Convierte texto en voces de IA expresivas y naturales para crear narraciones, diálogos y recursos educativos en audio.',extended:'Plataforma de generación de voz con IA que transforma texto en locuciones sintéticas y permite seleccionar voces, emociones, ritmo y estilos de interpretación. Facilita la producción de audioclases, narraciones, diálogos, videos explicativos y otros materiales multimedia sin requerir grabación de voz. Su aplicación educativa resulta especialmente útil para diversificar formatos, producir contenidos de manera ágil y apoyar experiencias de aprendizaje multimodales.',cases:[['Audioclase breve','Convertir una explicación escrita en un recurso sonoro.','La fotosíntesis es el proceso mediante el cual las plantas transforman la energía de la luz en energía química…'],['Diálogo para comprensión auditiva','Crear conversaciones con distintas voces para ejercicios de escucha en clases de idiomas.','Create a short dialogue between a customer and a waiter ordering breakfast at a restaurant. Use everyday English appropriate for A2 learners.'],['Narración y personajes','Dar voz a personajes, perspectivas o situaciones para videos, relatos y recursos multimedia.','Crea una conversación entre una científica y un estudiante que explique el efecto invernadero desde sus diferentes perspectivas.']],pros:['Produce locuciones naturales sin requerir equipo de grabación.','Permite adaptar voz, emoción y estilo al propósito del contenido.','Agiliza la creación de recursos educativos sonoros y multimedia.'],cons:['La naturalidad y expresividad pueden variar entre voces e idiomas.','Las funciones, voces y límites de generación dependen del plan disponible.','Requiere criterios de transparencia y uso responsable al utilizar voces sintéticas.']}"""

text = text[:array_end] + entry + text[array_end:]
path.write_text(text, encoding='utf-8')
print('Typecast added successfully.')
