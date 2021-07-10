//Set Units
app.preferences.rulerUnits = Units.PIXELS

var fileRef = File("C:\\Users\\devin\\OneDrive\\Desktop\\Etsy\\BellaMainMockup.jpg")
var mainFolder = Folder.selectDialog('Select Folder With Original Designs');
var transparentFolder = Folder.selectDialog('Select Folder For Outputting Transparent Designs');
var thumbnailFolder = Folder.selectDialog('Select Folder For Outputting Thumbsnails');

var files = mainFolder.getFiles();

for(var i = 0; i < files.length; i++)
{
    //Load Design
    var file = files[i]
    var docRef = app.open(file)
    var designName = file.name.substring(0, file.name.lastIndexOf('.'))

    //Select Background
    selectColorRange(
        RGBc(0.0, 0.0, 0.0),
        RGBc(3.0, 3.0, 3.0)
    );
    function cTID(s) { return app.charIDToTypeID(s); }
    function sTID(s) { return app.stringIDToTypeID(s); }
    function RGBc(r, g, b) {
        var color = new ActionDescriptor();
            color.putDouble( cTID("Rd  "), r);
            color.putDouble( cTID("Grn "), g);
            color.putDouble( cTID("Bl  "), b);   
        return color
    }
    function selectColorRange(color1, color2){
        var desc = new ActionDescriptor(); 
        desc.putInteger(cTID("Fzns"), 0 ); 
        desc.putObject( cTID("Mnm "), cTID("RGBC"), color1 ); 
        desc.putObject( cTID("Mxm "), cTID("RGBC"), color2 ); 
        executeAction( cTID("ClrR"), desc, DialogModes.NO );
    }

    //Delete Background
    activeDocument.selection.clear()
    activeDocument.selection.deselect()

    //Save Transparent Image
    var transparentFile = new File(transparentFolder + "/"+ designName + " Transparent.png")
    var pngSaveOptions = new PNGSaveOptions
    pngSaveOptions.compression = 9
    pngSaveOptions.interlaced = false
    activeDocument.saveAs( transparentFile , pngSaveOptions, true, Extension.LOWERCASE)

    //Close Image
    docRef.close(SaveOptions.DONOTSAVECHANGES)

    //Load Mockup    
    docRef = app.open(fileRef)
    
    //Add Layer
    var artLayerRef = docRef.artLayers.add()

    //Load Image from File (From Folder eventually)
    var idPlc = charIDToTypeID( "Plc " ); 
    var desc11 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );
    desc11.putPath( idnull, file );
    var idFTcs = charIDToTypeID( "FTcs" ); 
    var idQCSt = charIDToTypeID( "QCSt" );   
    var idQcsa = charIDToTypeID( "Qcsa" ); 
    desc11.putEnumerated( idFTcs, idQCSt, idQcsa );
    var idOfst = charIDToTypeID( "Ofst" );     
    var desc12 = new ActionDescriptor();     
    var idHrzn = charIDToTypeID( "Hrzn" );    
    var idPxl = charIDToTypeID( "#Pxl" );      
    desc12.putUnitDouble( idHrzn, idPxl, 0.000000 );     
    var idVrtc = charIDToTypeID( "Vrtc" );    
    var idPxl = charIDToTypeID( "#Pxl" );    
    desc12.putUnitDouble( idVrtc, idPxl, 0.000000 );
    var idOfst = charIDToTypeID( "Ofst" );
    desc11.putObject( idOfst, idOfst, desc12 );
    executeAction( idPlc, desc11, DialogModes.NO );

    //Place Image
    var newSize = 40
    activeDocument.activeLayer.resize(newSize, newSize, AnchorPosition.MIDDLECENTER)

    var angle = 4
    activeDocument.activeLayer.rotate(angle, AnchorPosition.MIDDLECENTER)

    var deltaX = -15
    var deltaY = -30
    activeDocument.activeLayer.translate(deltaX, deltaY)

    //Edit Content of Layer
    app.runMenuItem(stringIDToTypeID('placedLayerEditContents'))

    //Select Background
    selectColorRange(
        RGBc(0.0, 0.0, 0.0),
        RGBc(3.0, 3.0, 3.0)
    );

    //Delete Background
    activeDocument.selection.clear()
    activeDocument.selection.deselect

    //Close
    activeDocument.close(SaveOptions.SAVECHANGES)

    //Save (all layers) as one image
    var thumbnailFile = new File(thumbnailFolder + "/"+ designName + " Thumbnail.png")
    activeDocument.saveAs(thumbnailFile, pngSaveOptions, true, Extension.LOWERCASE)

    //Close
    activeDocument.close(SaveOptions.DONOTSAVECHANGES)
}