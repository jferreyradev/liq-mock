import { defineStore } from "pinia"
import { ref } from "vue"
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import download from 'downloadjs'
import logo from '../assets/logohcdt1.png'
import { useFilterStore } from '@/stores/filterStore.js'

export const useBoletatxt = defineStore('boletatxt', () => {

    const text = ref('')
    const cab = ref({})
    const det = ref([])
    const idliq = ref(0)

    async function setId(id) {
        const store = useFilterStore()
        idliq.value = id

        try {
            const resp1 = await fetch(`${store.URL_API}/view/boletaCabPie?IdLiq=${idliq.value}`)

            cab.value = await resp1.json()

            const resp = await fetch(`${store.URL_API}/view/boletaDetalle?IdLiq=${idliq.value}`)

            det.value = await resp.json()

        } catch (error) {
            console.log(error)
        }
    }

    async function createPdf() {

        console.log(cab.value)

        let text = '\n\n\n'
        text += cab.value[0]['C1'] + '\n';
        text += cab.value[0]['C2'] + '\n';
        text += cab.value[0]['C3'] + '\n';
        text += cab.value[0]['C4'] + '\n';
        text += cab.value[0]['C5'] + '\n';
        text += cab.value[0]['C6'] + '\n';

        text = text + '\n ' + '-'.padStart(77, '-')

        text = text + '\nCod Subcod Descripción               Cant  Vto         Haberes      Retenciones\n\n';

        let maxitems = 30

        det.value.forEach(element => {
            text = text + element['CADENA'].replace('  0.00', '      ') + '\n';
            maxitems--
        })

        while (maxitems > 0) {
            text = text + '\n';
            maxitems--
        }


        text = text + '\n\n ' + '-'.padStart(77, '-')
        
                text =
                    text +
                    `\n${cab.value[0]['HABTXT'].padStart(63)}${cab.value[0]['RETTXT']}
                      \n${'Neto a cobrar:'.padStart(62)} ${cab.value[0]['NETOTXT'].toLocaleString('es', { style: 'currency' }).padStart(12)}
                      \n Recibo Nro. ${idliq.value}`
        

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

        let fontSize = 8
        let font = fontCur
        for (let index = 0; index < textByline.length; index++) {
            const element = textByline[index]
            page.drawText(element, {
                x: 20,
                y: height - (index + 1) * fontSize,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0)
            })
            page.drawText(element, {
                x: width / 2 + 20,
                y: height - (index + 1) * fontSize,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0)
            })
        }

        page.drawText('ORIGINAL', {
            x: width / 2 - 75,
            y: height - fontSize - 10,
            size: 9,
            font: fontBold,
            color: rgb(0, 0, 0)
        })

        page.drawText('COPIA', {
            x: width - 55,
            y: height - fontSize - 10,
            size: fontSize,
            font: fontBold,
            color: rgb(0, 0, 0)
        })

        page.drawLine({
            start: { x: width / 2, y: 0 },
            end: { x: width / 2, y: height },
            thickness: 0.5,
            color: rgb(0.75, 0.2, 0.2),
            opacity: 0.15
        })

        const pdfBytes = await pdfDoc.save()
        //await pdfDoc.saveAsBase64({})
        //const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
        download(pdfBytes, cab.value[0]['FILENAME'], 'application/pdf')
        //return pdfBytes        
    }


    return { text, setId, cab, det, createPdf }
})