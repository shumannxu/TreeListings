from pathlib import Path
import google.generativeai as genai
import requests
import os

# global image variables for pre-training
image_dog = "https://res.cloudinary.com/lancaster-puppies-laravel/image/upload/v1671550999/breeds/oup4qu5bvfnfqbroeltm.jpg"
image_einstein = "https://i.etsystatic.com/12752553/r/il/7f47b0/4626246374/il_fullxfull.4626246374_ibz3.jpg"
image_weed = "https://images.newscientist.com/wp-content/uploads/2023/12/15201211/SEI_184200837.jpg?crop=4:3,smart&width=1200&height=900&upscale=true"
image_blanket = "https://i.ebayimg.com/images/g/eCcAAOSwMp1jD9~q/s-l1600.jpg"
class Listings:
    def __init__(self, image_links, title, description):
        self.preset_images = self.download_images([image_dog, image_einstein, image_weed, image_blanket])
        self.images = self.download_images(image_links)
        self.title = title
        self.description = description
        self.final_judgment = None
        self.justification = None

        # Initialize Gemini API model
        genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
        self.generation_config = {
            "temperature": 1,
            "top_p": 1,
            "top_k": 32,
            "max_output_tokens": 4096,
        }
        self.safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_ONLY_HIGH"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_ONLY_HIGH"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH"},
        ]
        self.model = genai.GenerativeModel(
            model_name="gemini-1.0-pro-vision-latest",
            generation_config=self.generation_config,
            safety_settings=self.safety_settings
        )
        self.justification = self.analyze_listing()
        self.delete_images()

    def download_images(self, image_links):
        images = []
        for link in image_links:
            try:
                # Download the image from the link and convert to Path object
                response = requests.get(link)
                if response.status_code == 200:
                    image_data = response.content
                    image_path = Path(f"image{len(images)}.jpeg")
                    with image_path.open("wb") as file:
                        file.write(image_data)
                    images.append(image_path)
                else:
                    print(f"Failed to download image from {link}")
            except Exception as e:
                print(f"Error downloading image from {link}: {e}")
        return images

    def delete_images(self):
        every_image = self.preset_images + self.images
        for image_path in every_image:
            image_path = Path(image_path)
            if image_path.exists():
                image_path.unlink()
        self.images, self.preset_images = [], []

    def analyze_listing(self):
        # Validate that images are present
        for idx, img_path in enumerate(self.images):
            if not img_path.exists():
                raise FileNotFoundError(f"Could not find image: {img_path}")

        # Prepare prompt parts
        prompt_parts = [
            "You will now be the judge of online marketplace listings whether or not they are appropriate to stay up on a university wide marketplace, similar to NSFW policies. You will receive a listing through its 3 parameters as such: Actual Image and [title, description]. For example, ",
            {"mime_type": "image/jpeg", "data": self.preset_images[0].read_bytes()},
            " [\"Daschund Puppy for Sale\", \"6 month old daschund puppy for sale, has all vet work and vaccinations done. He is very playful but needs a new home. Still needs to be potty trained. $500 OBO.\"] Your job is to return a judgement classifying posts as \"clean\" if it is appropriate", 
            " and \"removed\" if it does not belong in an online anti-NSFW marketplace alongside justification for why you made the judgement. You will return this judgement as a tuple: (\"Clean\" or \"Removed\", justification) and any word with quotations inside the justification must use single quotations. Here are some examples and their classifications to help guide your decision making: ",
            {"mime_type": "image/jpeg", "data": self.preset_images[1].read_bytes()},
            "[\"The Next Albert Einstein, $150\", \"This boy genius is a great companion and slightly used. $150, what a steal!\"] = Removed because human trafficking is implied here.﻿ Listings with too many spelling errors can indicate a scam listing; those should also be removed. Listings that contain revealed ",
            "contact information before a purchase should also be removed to protect identities until a purchase is agreed upon; however, this kind of listing can be clean if they are requesting friendships or advertising social event gatherings. Listings with offensive language, attacks on identity, or anything ",
            "else insulting are removed. Another removed listing should be any photo that confident does not match anything from the title or description. For example, a listing talking about selling a cat should at least contain 1 image of the cat. However, if it contains images of cat-related items, but not the ",
            "cat, then the image is irrelevant from the listing and thus, the listing is removed.",
            "input: ", {"mime_type": "image/jpeg", "data": self.preset_images[2].read_bytes()},"​[\"Selling weed for $35\", \"This is a legal amount of weed being sold for a great price. Meet outside of my dorm.\"]",
            "output: (\"Removed\", \"This listing contains illegal content and is therefore not appropriate for the marketplace.\")",
            "input: [“Selling new red bike”, “Red bike, almost brand new! Bought it to ride but never got around to doing it. Will deliver to your location upon request.”]",
            "output: (\"Removed\", \"This listing's images do not even contain a bike, indicating an inaccurate description and/or title. The image clearly shows a turtle.\")",
            "input: [“summer lease available”, “gonna lease out my apartment over the summer, right in the middle of campus, 2 room double”]",
            "output: (\"Clean\", “This listing does not contain any inappropriate content and is therefore appropriate for the marketplace.)",
            "input: [“Personal Gym Trainer”, “I’m a hobby triathlon athlete that likes working with people, and am willing to help you out at the gym a couple times per week! Reach out if you’d like more details.”]",
            "output: (\"Clean\", \"This listing does not contain any inappropriate content and is therefore appropriate for the marketplace.\")",
            "input: [\"Nerf Gun\", \"Brand new gun that shoots perfectly fine! Pick up today\"]",
            "output: (\"Clean\", \"Although this listing potentially contains a weapon, it is a children's toy, and is therefore not an actual weapon. Thus, it is perfectly fine to be sold for the marketplace.)",
            "input: [\"Kitchen knife set\", \"These are super sharp and are great for cutting things!\"]",
            "output: (\"Clean\", \"Although this listing contains a sharp object, kitchen knives are not considered a weapon, and thus are okay to sell in the marketplace.)",
            "input: [\"Want Free Money?\", \"Sign up for our research study at the GSB and you can be paid up to $30 hourly!\"]",
            "output: (\"Clean\", \"This may be an advertisement, but it is not inappropriate for the marketplace since it's not trying to sell anything malicious.\")",
            "input: [\"Need Help Moving\", \"plz need help move out tmrw. I pay lot of ca$h. plz help. tank u.\"]",
            "output: (\"Removed\", \"This listing is likely a scam because there are spelling errors, the content is unnatural, and the user is desperate.\")",
            "input: [\"Wanna make money?\", \"If you want to learn the secret tips, add me on WhatsApp @theHustler\"]",
            "output: (\"Removed\", \"This listing is likely a scam because it doesn't provide enough information and has the user contact through an external platform.\")",
            "input: [\"Party this Saturday\", \"There is a frat party on the Row at 6PM in Saturday. Pull through and Venmo me @fratguy for the entrance fee of $10. If you got questions, DM me on IG @thefratguy.\"]",
            "output: (\"Clean\", \"Although this contains personal contact information, the listing can stay up because it is advertising a public social gathering.\")",
            "input: [\"I want friends :(\", \"I'm getting so desperate to the point of not existing. Please add me as a friend on IG @thesaddude.\"]",
            "output: (\"Removed\", \"Listings promoting social activities on campus are perfectly fine, including requesting friendships; what is not allowed is the implicit mention of self-harm from \"to the point of not existing.\")",
            "input: [\"I want friends :(\", \"I'm a rfrosh and it's been hard to meet new ppl. Please add me as a friend on IG @thesaddude.\"]",
            "output: (\"Clean\", \"This listing is requesting a friendship on social media. It does not contain any inappropriate content and is therefore appropriate for the marketplace.\")",
            "input: [\"Getting rid of furniture.\", \"Please take all my shitty furniture. It's free I don't want it.\"]",
            "output: (\"Removed\", \" It contains profanity.\")",
            "input: [\"Rice cooker\", \"Brand new rice cooker, but I don't want to sell to white people. Otherwise plz come take it.\"]",
            "output: (\"Removed\", \"This listing contains inappropriate language and attacks a person’s race, which is not appropriate for the marketplace.\")",
            "input: [\"Rice cooker\", \"Brand new rice cooker, great for Asian households, plz come take it.\"]",
            "output: (\"Removed\", \"This listing attacks a person’s race, which is not appropriate for the marketplace.\")",
            "input: [\"Looking to trade test answers for cash\", \"Read title.\"]",
            "output: (\"Removed\", \"This listing is inappropriate because it involves buying and selling schoolwork/grades, which is prohibited on a university marketplace.\")",
            "input: [\"Selling Nuclear Fission Device\", \"The Stanford Chemistry Lab found a way to make renewable energy. Please buy this device for energy purposes only!\"]",
            "output: (\"Removed\", \"The listing will result in harm and therefore cannot be put on the marketplace.\")",
            "input: ", {"mime_type": "image/jpeg", "data": self.preset_images[3].read_bytes()},"[\"Red blanket\", \"Red blanket for sale. It is the reddest, most comfy blanket ever.\"]",
            "output: (\"Clean\", \"The listing's images do not contain a red blanket, but there is still a blanket. Since the listing is mostly accurate, it can remain on the marketplace.\"]",
            "\nDetect the appropriateness of the following listing: "]

        # Add the listing to be inspected to the prompt
        for img_path in self.images:
            prompt_parts.append({"mime_type": "image/jpeg", "data": img_path.read_bytes()})
        prompt_parts.append(f"[\"{self.title}\", \"{self.description}\"]")

        # Generate content using Gemini API
        response = self.model.generate_content(prompt_parts)

        # Parse Gemini API response
        error = None
        if response.text:
            result = response.text
            judgment = result.split('", "')[0]
            judgment = ''.join([i for i in judgment if i.isalpha()])
            if judgment == "Clean":
                self.final_judgment = True
            elif judgment == "Removed":
                self.final_judgment = False
            else:
                error = "Failed to extract judgment from Gemini API response."
                return error
            return result
        else:
            error = "Failed to make request to Gemini API."
        return error