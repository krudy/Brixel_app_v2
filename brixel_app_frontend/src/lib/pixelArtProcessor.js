class PixelArtProcessor {
  constructor(options = {}) {
      // Target canvas element
      this.targetCanvas = options.targetCanvas || document.getElementById("pixelArtCanvas");
      // Source image element
      this.sourceImage = options.sourceImage || document.getElementById("pixelArtImage");
      // Scaling factor (0 to 50)
      this.pixelScale =
          options.pixelScale && options.pixelScale > 0 && options.pixelScale <= 50
              ? options.pixelScale * 0.01
              : 40 * 0.01;
      this.colorPalette = options.colorPalette;
      this.maxCanvasHeight = options.maxCanvasHeight;
      this.maxCanvasWidth = options.maxCanvasWidth;
      this.canvasContext = this.targetCanvas.getContext("2d");
      // Stores the color statistics after processing
      this.colorStatistics = {};
  }

  /** Hide the source image */
  hideSourceImage() {
      this.sourceImage.style.visibility = "hidden";
      this.sourceImage.style.position = "fixed";
      this.sourceImage.style.top = 0;
      this.sourceImage.style.left = 0;
      return this;
  }

  /**
   * Update the source image's `src` attribute
   * @param {string} imageSource - URL or path of the new source image
   */
  updateSourceImageSource(imageSource) {
      this.sourceImage.src = imageSource;
      return this;
  }

  /**
   * Update the element used as the source image
   * @param {HTMLElement} element - The new source image element
   */
  setSourceImage(element) {
      this.sourceImage = element;
      return this;
  }

  /**
   * Update the canvas element where the image will be drawn
   * @param {HTMLElement} element - The new target canvas element
   */
  setTargetCanvas(element) {
      this.targetCanvas = element;
      return this;
  }

  /**
   * Define a new color palette
   * @param {Array} colors - An array of RGB color arrays [[int, int, int], ...]
   */
  setColorPalette(colors) {
      this.colorPalette = colors;
      return this;
  }

  /**
   * Set the maximum canvas width for resizing
   * @param {number} width - Maximum canvas width
   */
  setMaxCanvasWidth(width) {
      this.maxCanvasWidth = width;
      return this;
  }

  /**
   * Set the maximum canvas height for resizing
   * @param {number} height - Maximum canvas height
   */
  setMaxCanvasHeight(height) {
      this.maxCanvasHeight = height;
      return this;
  }

  /**
   * Set the pixelation scale
   * @param {number} scale - Scale value between 0 and 50
   */
  setPixelScale(scale) {
      this.pixelScale = scale > 0 && scale <= 50 ? scale * 0.01 : 8 * 0.01;
      return this;
  }

  /**
   * Retrieve the current color palette
   * @returns {Array} - Current palette as an array of RGB colors
   */
  getColorPalette() {
      return this.colorPalette;
  }

  /**
   * Calculate color similarity
   * @param {Array} colorA - RGB array of the first color
   * @param {Array} colorB - RGB array of the second color
   * @returns {number} - Color difference
   */
  calculateColorSimilarity(colorA, colorB) {
      return Math.sqrt(
          colorA.reduce((sum, value, index) => sum + Math.pow(value - colorB[index], 2), 0)
      );
  }

  /**
   * Find the closest matching color in the palette
   * @param {Array} color - RGB array of the input color
   * @returns {Array} - Closest RGB color from the palette
   */
  findClosestPaletteColor(color) {
      let closestColor = this.colorPalette[0];
      let minDifference = this.calculateColorSimilarity(color, closestColor);

      this.colorPalette.forEach(paletteColor => {
          const difference = this.calculateColorSimilarity(color, paletteColor);
          if (difference < minDifference) {
              closestColor = paletteColor;
              minDifference = difference;
          }
      });

      return closestColor;
  }

  /**
   * Pixelate the image on the canvas
   */
  pixelateImage() {
      this.targetCanvas.width = this.sourceImage.naturalWidth;
      this.targetCanvas.height = this.sourceImage.naturalHeight;
      let scaledWidth = this.targetCanvas.width * this.pixelScale;
      let scaledHeight = this.targetCanvas.height * this.pixelScale;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = Math.max(scaledWidth, scaledHeight) + 50;
      tempCanvas.height = Math.max(scaledWidth, scaledHeight) + 50;

      const tempContext = tempCanvas.getContext("2d");
      tempContext.drawImage(this.sourceImage, 0, 0, scaledWidth, scaledHeight);

      this.canvasContext.imageSmoothingEnabled = false;
      this.canvasContext.drawImage(
          tempCanvas,
          0,
          0,
          scaledWidth,
          scaledHeight,
          0,
          0,
          this.targetCanvas.width,
          this.targetCanvas.height
      );

      tempCanvas.remove();
      return this;
  }

  /**
   * Convert the image to grayscale
   */
  convertToGrayscale() {
      const imageData = this.canvasContext.getImageData(0, 0, this.targetCanvas.width, this.targetCanvas.height);
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
          const grayValue = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = grayValue;
      }

      this.canvasContext.putImageData(imageData, 0, 0);
      return this;
  }

  /**
   * Convert the image colors to match the defined palette
   */
  convertToPalette() {
      const imageData = this.canvasContext.getImageData(0, 0, this.targetCanvas.width, this.targetCanvas.height);
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
          const closestColor = this.findClosestPaletteColor([data[i], data[i + 1], data[i + 2]]);
          [data[i], data[i + 1], data[i + 2]] = closestColor;
      }

      this.canvasContext.putImageData(imageData, 0, 0);
      return this;
  }

  /**
   * Resize the image while maintaining proportions
   */
  resizeCanvasImage() {
      const tempCanvas = document.createElement("canvas");
      const tempContext = tempCanvas.getContext("2d");

      let ratio = 1.0;
      if (this.maxCanvasWidth && this.targetCanvas.width > this.maxCanvasWidth) {
          ratio = this.maxCanvasWidth / this.targetCanvas.width;
      }
      if (this.maxCanvasHeight && this.targetCanvas.height > this.maxCanvasHeight) {
          ratio = this.maxCanvasHeight / this.targetCanvas.height;
      }

      tempCanvas.width = this.targetCanvas.width;
      tempCanvas.height = this.targetCanvas.height;
      tempContext.drawImage(this.targetCanvas, 0, 0);

      this.targetCanvas.width *= ratio;
      this.targetCanvas.height *= ratio;

      this.canvasContext.imageSmoothingEnabled = false;
      this.canvasContext.drawImage(
          tempCanvas,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height,
          0,
          0,
          this.targetCanvas.width,
          this.targetCanvas.height
      );

      return this;
  }

  /**
   * Draw the image on the canvas and apply resizing
   */
  renderImage() {
      this.targetCanvas.width = this.sourceImage.width;
      this.targetCanvas.height = this.sourceImage.height;
      this.canvasContext.drawImage(this.sourceImage, 0, 0);
      this.resizeCanvasImage();
      return this;
  }

  /**
   * Save the canvas image as a PNG file
   */
  saveCanvasImage() {
      const link = document.createElement("a");
      link.download = "PixelArt.png";
      link.href = this.targetCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
}

export default PixelArtProcessor;