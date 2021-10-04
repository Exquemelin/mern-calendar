// Importamos la response del package express para tener la intellisense y toda la ayuda
const { response } = require('express');

// Importamos el paquete file-system
const fs = require('file-system');

// Importamos el paquete path
const path = require('path');

// TODO: Limpiar código
// Creamos una función básica para experimentar con el PDF

// Importamos el pdfKit para usarlo
const PDFDocument = require('pdfkit');


// TODO: ver como hacer la espera a que termine de generarse el documento antes de devolverlo
const testReport = async ( req, res = response ) => {

    // Creamos un nuevo documento
    const doc = new PDFDocument;


    console.log( req.body );

    const { panel, points } = req.body;

    var path = './public/files/reports/file.pdf';

    const done = await createReport( panel, points, path );

    console.log('========== LISTO ==========')

    // doc.pipe(fs.createWriteStream( path ) ); // write to PDF
    // const file = doc.pipe(fs.createWriteStream( path ) ); // write to PDF
    // const file = doc.pipe();       
    // file.pipe                                // HTTP response


    // // add stuff to PDF here using methods described below...

    //     const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eulacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl.';
    //     doc.fontSize(8);
    //     doc.text(`Nombre del cuadro: ${ panel.name }`, {
    //     width: 410,
    //     align: 'left'
    //     }
    //     );
    //     doc.moveDown();
    //     doc.text(`Número de Serie: ${ panel.serial }`, {
    //     width: 410,
    //     align: 'left'
    //     }
    //     );
    //     doc.moveDown();
    //     doc.text(`Unidades:  ${ panel.units }`, {
    //     width: 410,
    //     align: 'right'
    //     }
    //     );
    //     doc.moveDown();
    //     categories.map( (cat) => {

    //         let res = '';

    //         if ( cat.result ) {
    //             res = 'OK'
    //         } else {
    //             res = 'NO OK'
    //         }
    //         doc.text(`${ cat.category } ha resultado ${ res }`)
    //     })

        
    
    // // finalize the PDF and end the stream
    // doc.end();

    // doc.pipe(fs.createWriteStream( path ) ); // write to PDF
    
    // TODO: Arreglar el problema de las rutas
    if (done) {

        setTimeout(() => {
            
            return res.status(200).sendFile( `e:/react/10-calendar-backend/public/files/reports/file.pdf`, { maxAge: 1000 }, function ( err ) {
                if ( err ) {
                    console.log( err );
                } else {
                    console.log("Se envío")
                }
            } );

        }, 2000);

        // var filestream = fs.createReadStream(file);
        // filestream.pipe(res);
    }


}

const createReport = ( panel, points, path ) => {

    // Creamos un nuevo documento
    var doc = new PDFDocument;

    // var stream = doc.pipe( fs.createWriteStream( path ) );


    // var path = './public/files/reports/file.pdf';

    // doc.pipe(fs.createWriteStream( path ) ); // write to PDF
    // const file = doc.pipe(fs.createWriteStream( path ) ); // write to PDF
    // const file = doc.pipe();       
    // file.pipe                                // HTTP response


    // add stuff to PDF here using methods described below...

    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eulacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl.';
    doc.fontSize(8);
    doc.text(`Nombre del cuadro: ${ panel.name }`, {
        width: 410,
        align: 'left'
    }
    );
    doc.moveDown();
    doc.text(`Número de Serie: ${ panel.serial }`, {
        width: 410,
        align: 'left'
    }
    );
    doc.moveDown();
    doc.text(`Unidades:  ${ panel.units }`, {
        width: 410,
        align: 'right'
    }
    );
    doc.moveDown();
    points.map( (pt) => {

        // let res = '';

        // if ( pt.result ) {
        //     res = 'OK'
        // } else {
        //     res = 'NO OK'
        // }
        doc.text(`${ pt.nonConformity }`)
    })
    
    doc.end();

    doc.pipe( fs.createWriteStream( path ) ) // write to PDF

    // stream.on('finish', () => {

        console.log("========== Pruebas PDF ==========")
        return true;

    // })



}

    // TODO: Arreglar el problema de las rutas

// Función que procesará la petición de un certificate en pdf
const testCertificate = async ( req, res = response ) => {

    // Creamos un nuevo documento
    const doc = new PDFDocument;

    // Desestructuramos las variables que nos llegan en el request
    const { panel, categories, steps } = req.body;

    // Establecemos la dirección donde se va a guardar el archivo
    var path = './public/files/certificates/file.pdf';

    // LLamamos la función que va a crear el certificado y le pasamos los datos
    // Nos va a devolver un true cuando termine
    const done = await createCertificate( panel, categories, steps, path );

    console.log('========== CERT LISTO ==========')
    
    // Si todo salió bien, esperamos 2 segundos y devolvemos la respuesta con el archivo
    if (done) {

        setTimeout(() => {
            
            return res.status(200).sendFile( `e:/react/10-calendar-backend/public/files/certificates/file.pdf`, { maxAge: 1000 }, function ( err ) {
                if ( err ) {
                    console.log( err );
                } else {
                    console.log("Se envío")
                }
            } );
            
        }, 2000);

    };

};

// Función que creará el certificado en pdf y lo guardará en el servidor
const createCertificate = ( panel, categories, steps, path) => {

    // Creamos un nuevo documento
    var doc = new PDFDocument;

    // Vamos añadiendo contenido al pdf
    doc.fontSize(8);
    doc.text(`Nombre del cuadro: ${ panel.name }`, {
        width: 410,
        align: 'left'
    }
    );
    doc.moveDown();
    doc.text(`Número de Serie: ${ panel.serial }`, {
        width: 410,
        align: 'left'
    }
    );
    doc.moveDown();
    doc.text(`Unidades:  ${ panel.units }`, {
        width: 410,
        align: 'right'
    }
    );
    doc.moveDown();
    categories.map( (cat) => {

        // declaramos una variable para transformar la booleana en texto
        let res = '';

        // En función del valor booleano del resultado le asignamos un string
        if ( cat.result ) {
            res = 'OK'
        } else {
            res = 'NO OK'
        }
        doc.text(`${ cat.category } se ha probado con un resultado de ${ res }`)
    })
    
    // Finalizamos el documento
    doc.end();

    // Guardamos el documento en pdf dentro de un directorio
    doc.pipe( fs.createWriteStream( path ) ) // write to PDF

    // stream.on('finish', () => {

        console.log("========== Certificado PDF ==========")
        return true;

    // })


}

module.exports = {
    testReport,
    testCertificate,
}