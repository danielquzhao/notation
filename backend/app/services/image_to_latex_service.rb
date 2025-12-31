class ImageToLatexService
  def initialize(image_file)
    @image_file = image_file
    @client = Google::Generative::Client.new(api_key: ENV["GEMINI_API_KEY"])
  end

  def convert
    # Read the image file and encode to base64
    image_data = File.read(@image_file.path)
    base64_image = Base64.strict_encode64(image_data)

    # Determine MIME type based on file extension
    mime_type = determine_mime_type(@image_file.content_type || @image_file.filename)

    # Call Gemini Vision API
    response = @client.generate_content(
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: vision_prompt },
          {
            inline_data: {
              mime_type: mime_type,
              data: base64_image
            }
          }
        ]
      }
    )

    # Extract and return the text content
    response.dig("candidates", 0, "content", "parts", 0, "text") || ""
  rescue StandardError => e
    raise "Error converting image to LaTeX: #{e.message}"
  end

  private

  def vision_prompt
    <<~PROMPT
      Analyze this image of handwritten math notes. Extract all the text and mathematical equations.
      
      For mathematical expressions:
      - Use LaTeX syntax enclosed in $ for inline math or $$ for display math
      - Preserve the structure and layout of the original content
      
      Return the extracted content in a clean format with:
      1. Regular text as-is
      2. Math equations in proper LaTeX syntax
      3. Preserve section structure (headings, lists, etc.)
      
      Do not add any additional formatting or commentary - just extract and convert the content.
    PROMPT
  end

  def determine_mime_type(content_type)
    case content_type
    when /jpeg/, /jpg/
      "image/jpeg"
    when /png/
      "image/png"
    when /gif/
      "image/gif"
    when /webp/
      "image/webp"
    else
      "image/jpeg" # Default to JPEG
    end
  end
end
