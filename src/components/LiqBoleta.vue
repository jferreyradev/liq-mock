<script setup>
import { computed, ref } from 'vue'
import items from '../liqItem.json'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import download from 'downloadjs'
import logo from '../assets/logohcdt1.png'

const data = ref(items)

const liqHeaders = [
  { title: 'Codigo.', key: 'CODIGO' },
  { title: 'Descripcion', key: 'DESCRIPCION' },
  { title: 'Cant', key: 'CANTIDAD' },
  { title: 'VTO', key: 'VENCIMIENTO' },
  { title: 'Importe', key: 'IMPORTE' }
]

const getVto = (vto) => {
  if (vto) {
    const d = vto.split('-')
    return `${d[1]}/${d[0]}`
  }
  return null
}

//const items = ref([])

const sortItems = () => {
  //let items = data.filter((x) => x.LIQUIDACIONID === 3360)

  data.value.sort((a, b) => {
    if (a.CODIGO * 1000 + a.SUBCODIGO > b.CODIGO * 1000 + b.SUBCODIGO) {
      return 1
    }
    if (a.CODIGO * 1000 + a.SUBCODIGO < b.CODIGO * 1000 + b.SUBCODIGO) {
      return -1
    }
    return 0
  })
}

sortItems()

function getNumberFormat(n) {
  return Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)
}

const res = computed(() => {
  let hcap = 0,
    hsap = 0,
    ticket = 0,
    desc = 0,
    descley = 0,
    asigfam = 0,
    patronales = 0
  data.value.forEach((el) => {
    switch (el.TIPOCONCEPTOID) {
      case 1:
        hcap = hcap + el.IMPORTETICKET
        break
      case 2:
        hsap = hsap + el.IMPORTETICKET
        break
      case 3:
        descley = descley + el.IMPORTETICKET
        break
      case 4:
        asigfam = asigfam + el.IMPORTETICKET
        break
      case 5:
        patronales = patronales + el.IMPORTETICKET
        break
      case 7:
        ticket = ticket + el.IMPORTETICKET
        break
      case 6:
        desc = desc + el.IMPORTETICKET
        break
      default:
        break
    }
  })

  return { hcap, hsap, ticket, descley, desc, asigfam }
})

async function createPdf() {
  let text =
    '\n\n' +
    String.raw` REP: ${''} - ${''}
 Dirección: ${''} - CUIT: ${''}

 NOMBRE: ${''}          APELLIDO: ${''}
 ORDEN:  ${''}          AFILIADO: ${''}         CUIL: ${''}
 DNI:    ${''}          CAT: ${''}

 LIQUIDACION: ${''}       PERIODO DE LIQUIDACION: ${''}`

  text = text + '\n ' + '-'.padStart(77, '-')

  text =
    text +
    '\n\n' +
    'Código'.padStart(7) +
    ' ' +
    'Descripción'.padEnd(25) +
    'Cantidad'.padStart(7) +
    'VTO'.padStart(8) +
    'Haberes'.padStart(12) +
    'Descuentos'.padStart(12) +
    '\n'

  let neto = 0,
    haberes = 0,
    retenciones = 0

  data.value.forEach((element) => {
    if (element['TIPOCONCEPTOID'] !== 5) {
      text =
        text +
        '\n' +
        element['CODIGO'].toString().padStart(4) +
        element['SUBCODIGO'].toString().padStart(3, '0') +
        ' ' +
        element['DESCRIPCION'].toString().padEnd(25) +
        element['CANTIDAD'].toString().padStart(7)

      if (element['VENCIMIENTO'] === null) {
        text = text + ''.toString().padStart(10)
      } else {
        let vto = element['VENCIMIENTO'].split('/')
        console.log(vto[1].substring(2, 4))
        text = text + (vto[0] + '/' + vto[1].substring(2, 4)).toString().padStart(10)
      }

      if (element['CODIGO'] < 100) {
        text = text + element['IMPORTE'].toFixed(2).toString().padStart(11)
      } else {
        text = text + element['IMPORTE'].toFixed(2).toString().padStart(23)
      }
    }
    if (
      element['TIPOCONCEPTOID'] == 1 ||
      element['TIPOCONCEPTOID'] == 2 ||
      element['TIPOCONCEPTOID'] == 7
    ) {
      haberes = haberes + element['IMPORTE']
    } else if (element['TIPOCONCEPTOID'] == 3 || element['TIPOCONCEPTOID'] == 6) {
      retenciones = retenciones + element['IMPORTE']
    }
  })

  text = text + '\n\n ' + '-'.padStart(77, '-')

  //retenciones = retenciones * -1
  neto = haberes - retenciones

  text =
    text +
    `\n${haberes.toFixed(2).toString().padStart(61)}${retenciones.toFixed(2).toString().padStart(12)}
        \n${'Neto a cobrar:'.padStart(60)} ${neto.toFixed(2).toLocaleString('es', { style: 'currency' }).padStart(12)}`

  const textByline = text.toString().split('\n')

  const pdfDoc = await PDFDocument.create()
  const fontCur = await pdfDoc.embedFont(StandardFonts.Courier)
  const fontBold = await pdfDoc.embedFont(StandardFonts.CourierBold)

  const page = pdfDoc.addPage([841.89, 595.28])
  const { width, height } = page.getSize()

  // Image

  const pngUrl = logo

  const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer())

  const pngImage = await pdfDoc.embedPng(pngImageBytes)

  const pngDims = pngImage.scale(0.4)

  page.drawImage(pngImage, {
    x: page.getWidth() / 4 - pngDims.width / 2,
    y: page.getHeight() / 2 - pngDims.height + 200,
    width: pngDims.width,
    height: pngDims.height
  })

  page.drawImage(pngImage, {
    x: page.getWidth() - pngDims.width - 100,
    y: page.getHeight() / 2 - pngDims.height + 200,
    width: pngDims.width,
    height: pngDims.height
  })

  let fontSize = 9
  let font = fontCur
  for (let index = 0; index < textByline.length; index++) {
    const element = textByline[index]
    page.drawText(element, {
      x: 10,
      y: height - (index + 1) * fontSize,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0)
    })
    page.drawText(element, {
      x: width / 2 + 10,
      y: height - (index + 1) * fontSize,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0)
    })
  }

  page.drawText('ORIGINAL', {
    x: width / 2 - 50,
    y: height - fontSize - 10,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0)
  })

  page.drawText('COPIA', {
    x: width - 50,
    y: height - fontSize - 10,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 0)
  })

  page.drawLine({
    start: { x: width / 2 + 10, y: 0 },
    end: { x: width / 2 + 10, y: height },
    thickness: 0.5,
    color: rgb(0.75, 0.2, 0.2),
    opacity: 0.15
  })

  const pdfBytes = await pdfDoc.save()
  //await pdfDoc.saveAsBase64({})
  //const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
  download(pdfBytes, 'pdf-lib_example.pdf', 'application/pdf')
  //return pdfBytes
}
</script>

<template>
  <div>
    <h2>Detalle de liquidación</h2>
    <table>
      <thead>
        <tr>
          <th v-for="header in liqHeaders" :key="header.key">
            {{ header.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in data"
          :key="item.id"
          v-show="item.TIPOCONCEPTOID !== 5"
          :class="{
            'bg-orange-lighten-3': item.TIPOCONCEPTOID === 6,
            'bg-orange-lighten-4': item.TIPOCONCEPTOID === 3,
            'bg-orange-lighten-5': item.TIPOCONCEPTOID === 4,
            'bg-blue-lighten-5': item.TIPOCONCEPTOID === 1
          }"
        >
          <td class="right">{{ item.CODIGO * 1000 + item.SUBCODIGO }}</td>
          <td class="">{{ item.DESCRIPCION }}</td>
          <td class="right">{{ item.CANTIDAD }}</td>
          <td class="text-center m-0 p-0">{{ item.VENCIMIENTO }}</td>
          <td class="right">{{ item.IMPORTE.toFixed(2) }}</td>
        </tr>
      </tbody>
      <tfoot class="font-weight-bold">
        <tr>
          <td>Haberes</td>
          <td>Descuentos</td>
          <td>Total</td>
        </tr>
        <tr>
          <td>
            {{ getNumberFormat(res.hcap + res.hsap + res.asigfam) }}
          </td>
          <td>
            {{ getNumberFormat(res.desc + res.descley) }}
          </td>
          <td>
            {{ getNumberFormat(res.hcap + res.hsap + res.asigfam - res.desc - res.descley) }}
          </td>
        </tr>
      </tfoot>
    </table>
    <button @click="createPdf">Genera PDF</button>
    <a :href="createPdf" download="myFile.pdf">link</a>
  </div>
</template>

<style scoped>
tfoot {
  background-color: gray;
  font-weight: bold;
}
.right {
  text-align: end;
}
</style>