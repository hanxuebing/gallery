export class ConsoleUtil {
    public static printMatrix4(matrix4: Float32Array) {
        var matrixCount = matrix4.length;
        console.log(matrix4[0], matrix4[1], matrix4[2], matrix4[3]);
        console.log(matrix4[4], matrix4[5], matrix4[6], matrix4[7]);
        console.log(matrix4[8], matrix4[9], matrix4[10], matrix4[11]);
        console.log(matrix4[12], matrix4[13], matrix4[14], matrix4[15]);
        // console.log(matrix4[i]);

    }
}