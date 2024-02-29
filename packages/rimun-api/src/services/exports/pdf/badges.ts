import fontkit from "@pdf-lib/fontkit";
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  RGB,
  rgb,
  StandardFonts,
} from "pdf-lib";
import sharp from "sharp";
import { z } from "zod";

import { BLUE, GREEN, PATH_FONT_PINYONSCRIPT, RED, YELLOW } from "./constants";
import type { AttendeeData, SessionData } from "./types";
import {
  convertPointToPixel,
  fixNonWinAnsiString,
  formatOrdinal,
  getFileBytes,
  mergeDocs,
} from "./utils";

const renderOptionsSchema = z.object({
  docHeight: z.number().default(175),
  docWidth: z.number().default(300),
  roleBannerHeight: z.number().default(20),
  mainRectHeight: z.number().default(142),
  framePadding: z.number().default(14.15),
  frameWidth: z.number().default(0.5),
  pictureSize: z.number().default(62),
});

type RenderOptions = z.infer<typeof renderOptionsSchema>;

/**
 * Generate PDF file containing badges for the provided attendees.
 * @param attendees List of attendees information obtained from the API's `search` router
 * @param opts Configuration options
 * @returns Base64 encoded PDF file
 */
export async function generateBadges(
  attendees: AttendeeData[],
  session: SessionData,
  retrieveProfilePicture: (path: string) => Promise<Buffer | null>,
  nBlankPerRole = 10,
  renderOptions = renderOptionsSchema.parse({})
) {
  const serifFont = await getFileBytes(PATH_FONT_PINYONSCRIPT);

  const vOpts = { nBlankPerRole, renderOptions };
  const tasks = attendees.map((a) =>
    renderBadge(
      a,
      session,
      vOpts.renderOptions,
      serifFont,
      retrieveProfilePicture
    )
  );

  // empty docs for last minute registrations/missing badges
  const dummyAttendees = [
    makeDummyAttendee("Delegate", "delegate"),
    makeDummyAttendee("Director", "director"),
    makeDummyAttendee("Staff", "staff"),
    makeDummyAttendee("Guest", "guest"),
  ];
  for (let i = 0; i < vOpts.nBlankPerRole; i++) {
    tasks.push(
      ...dummyAttendees.map((a) =>
        renderBadge(
          a,
          session,
          vOpts.renderOptions,
          serifFont,
          retrieveProfilePicture
        )
      )
    );
  }

  const docs = await Promise.all(tasks);
  const out = await mergeDocs(docs);

  return out.toString("base64");
}

export function makeDummyAttendee(
  roleName: string,
  groupName: string
): AttendeeData {
  return {
    // @ts-ignore
    confirmed_role: { name: roleName },
    // @ts-ignore
    confirmed_group: { name: groupName },
  };
}

async function renderBadge(
  attendee: AttendeeData,
  sessionData: SessionData,
  opts: RenderOptions,
  serifFont: Uint8Array,
  retrieveProfilePicture: (path: string) => Promise<Buffer | null>
): Promise<PDFDocument> {
  const doc = await PDFDocument.create();
  doc.addPage([opts.docWidth, opts.docHeight]);
  doc.registerFontkit(fontkit);

  const timesFont = await doc.embedFont(StandardFonts.TimesRoman);
  const timesItalicFont = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const timesItalicBoldFont = await doc.embedFont(
    StandardFonts.TimesRomanBoldItalic
  );
  const pinyonFont = await doc.embedFont(serifFont);

  const page = doc.getPage(0);

  // draw main rectangle
  page.drawRectangle({
    x: opts.framePadding,
    y: opts.framePadding,
    width: page.getWidth() - opts.framePadding * 2,
    height: opts.mainRectHeight,
    borderWidth: opts.frameWidth,
    borderColor: rgb(0, 0, 0),
  });

  let committeeName = attendee.committee?.name;
  if (committeeName && committeeName.includes("-")) {
    committeeName = committeeName.split("-")[1].trim();
  }

  if (attendee.confirmed_role) {
    await drawRoleBanner(
      page,
      attendee.confirmed_group?.name === "delegate"
        ? committeeName ?? attendee.confirmed_role.name
        : attendee.confirmed_role.name,
      getGroupColor(attendee.confirmed_group!.name),
      timesFont,
      opts
    );
  }

  const ordinal = formatOrdinal(sessionData!.edition_display);

  await drawSessionInfo(
    page,
    timesItalicFont,
    `${ordinal} Session ${sessionData?.date_start?.getFullYear()}`,
    opts
  );
  await drawTitle(page, pinyonFont, opts);
  await drawName(
    page,
    timesFont,
    timesItalicFont,
    attendee.person?.name ?? "",
    attendee.person?.surname ?? "",
    ["director", "secretariat"].includes(attendee.confirmed_group!.name),
    opts
  );

  if (attendee.school)
    await drawSchool(
      page,
      timesItalicBoldFont,
      timesItalicFont,
      attendee.school.name,
      `${attendee.school.city}, ${attendee.school.country.name}`,
      opts
    );

  if (attendee.delegation) {
    await drawDelegation(
      page,
      timesFont,
      attendee.delegation.country
        ? attendee.delegation.country.name
        : attendee.delegation.name ?? "",
      opts
    );
  }

  if (attendee.person && attendee.person.picture_path) {
    try {
      const imgBuffer = await retrieveProfilePicture(
        attendee.person.picture_path
      );

      if (imgBuffer) {
        const imgSizePixel = convertPointToPixel(opts.pictureSize);

        const image = await doc.embedPng(
          await sharp(imgBuffer)
            .png({ quality: 25, compressionLevel: 9, effort: 10 })
            .resize(imgSizePixel, imgSizePixel, { fit: "cover" })
            .toBuffer()
        );

        page.drawImage(image, {
          x:
            opts.framePadding +
            (page.getWidth() - opts.framePadding * 2) / 4 -
            opts.pictureSize / 2,
          y:
            opts.framePadding +
            opts.roleBannerHeight +
            (opts.mainRectHeight - opts.roleBannerHeight) / 2 -
            opts.pictureSize / 2,
          height: opts.pictureSize,
          width: opts.pictureSize,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  page.drawRectangle({
    x:
      opts.framePadding +
      (page.getWidth() - opts.framePadding * 2) / 4 -
      opts.pictureSize / 2,
    y:
      opts.framePadding +
      opts.roleBannerHeight +
      (opts.mainRectHeight - opts.roleBannerHeight) / 2 -
      opts.pictureSize / 2,
    height: opts.pictureSize,
    width: opts.pictureSize,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.5,
  });

  return doc;
}

async function drawRoleBanner(
  page: PDFPage,
  text: string,
  color: RGB,
  font: PDFFont,
  opts: RenderOptions
) {
  page.drawRectangle({
    x: opts.framePadding,
    y: opts.framePadding,
    width: page.getWidth() - opts.framePadding * 2,
    height: opts.roleBannerHeight,
    color,
    borderWidth: opts.frameWidth,
    borderColor: rgb(0, 0, 0),
  });

  const roleText = text.includes("Conference Manager")
    ? "CONFERENCE MANAGER"
    : text.toUpperCase();

  let roleTextSize = 10;
  let roleTextWidth = font.widthOfTextAtSize(roleText, roleTextSize);
  let roleTextHeight = font.heightAtSize(roleTextSize, { descender: false });
  while (roleTextWidth > page.getWidth() - opts.framePadding * 2) {
    roleTextSize--;
    roleTextWidth = font.widthOfTextAtSize(roleText, roleTextSize);
    roleTextHeight = font.heightAtSize(roleTextSize, { descender: false });
  }

  page.drawText(roleText, {
    x: page.getWidth() / 2 - roleTextWidth / 2,
    y: opts.framePadding + opts.roleBannerHeight / 2 - roleTextHeight / 2,
    size: roleTextSize,
    color: rgb(1, 1, 1),
    font,
  });
}

async function drawTitle(page: PDFPage, font: PDFFont, opts: RenderOptions) {
  const titleText = "Rome International Model United Nations";
  const titleTextSize = 9;
  const titleTextWidth = font.widthOfTextAtSize(titleText, titleTextSize);
  const titleTextHeight = font.heightAtSize(titleTextSize, {
    descender: false,
  });

  page.drawRectangle({
    x: page.getWidth() / 2 - titleTextWidth / 2 - 5,
    y: opts.mainRectHeight + opts.framePadding - titleTextHeight / 2,
    width: titleTextWidth + 10,
    height: titleTextHeight,
    color: rgb(1, 1, 1),
  });

  page.drawText(titleText, {
    x: page.getWidth() / 2 - titleTextWidth / 2,
    y: opts.mainRectHeight + opts.framePadding - titleTextHeight / 2,
    size: titleTextSize,
    color: rgb(0, 0, 0),
    font,
  });
}

async function drawSessionInfo(
  page: PDFPage,
  font: PDFFont,
  text: string,
  opts: RenderOptions
) {
  const size = 5;
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: page.getWidth() / 2 - width / 2,
    y: opts.framePadding + opts.roleBannerHeight + 3.5,
    color: rgb(0, 0, 0),
    size,
    font,
  });
}

async function drawName(
  page: PDFPage,
  font: PDFFont,
  fontHE: PDFFont,
  _firstNameText: string,
  _lastNameText: string,
  isHE: boolean = false,
  opts: RenderOptions
) {
  const firstNameText = fixNonWinAnsiString(_firstNameText, font);
  const lastNameText = fixNonWinAnsiString(_lastNameText, font);

  let size = 14;
  const nameTextHeight = font.heightAtSize(size, { descender: false });
  const firstNameTextWidth = font.widthOfTextAtSize(firstNameText, size);
  const lastNameTextWidth = font.widthOfTextAtSize(lastNameText, size);

  page.drawText(firstNameText, {
    x:
      opts.framePadding +
      ((page.getWidth() - opts.framePadding * 2) / 4) * 3 -
      15 -
      firstNameTextWidth / 2,
    y:
      opts.framePadding +
      opts.roleBannerHeight +
      (opts.mainRectHeight - opts.roleBannerHeight) / 2 +
      1.5,
    size,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(lastNameText, {
    x:
      opts.framePadding +
      ((page.getWidth() - opts.framePadding * 2) / 4) * 3 -
      15 -
      lastNameTextWidth / 2,
    y:
      opts.framePadding +
      opts.roleBannerHeight +
      (opts.mainRectHeight - opts.roleBannerHeight) / 2 -
      1.5 -
      nameTextHeight,
    size,
    font,
    color: rgb(0, 0, 0),
  });

  if (isHE) {
    size = 8;
    const heText = "H.E.";
    const heTextWidth = font.widthOfTextAtSize(heText, size);

    page.drawText(heText, {
      x:
        opts.framePadding +
        ((page.getWidth() - opts.framePadding * 2) / 4) * 3 -
        15 -
        heTextWidth / 2,
      y:
        opts.framePadding +
        opts.roleBannerHeight +
        (opts.mainRectHeight - opts.roleBannerHeight) / 2 +
        6 +
        nameTextHeight,
      size,
      font: fontHE,
      color: rgb(0, 0, 0),
    });
  }
}

async function drawDelegation(
  page: PDFPage,
  font: PDFFont,
  _delegationText: string,
  opts: RenderOptions
) {
  const delegationText = fixNonWinAnsiString(_delegationText, font);

  let size = 11;
  const delegationTextWidth = font.widthOfTextAtSize(delegationText, size);

  page.drawText(delegationText, {
    x:
      opts.framePadding +
      ((page.getWidth() - opts.framePadding * 2) / 4) * 3 -
      15 -
      delegationTextWidth / 2,
    y:
      opts.framePadding +
      opts.roleBannerHeight +
      (opts.mainRectHeight - opts.roleBannerHeight) / 2 +
      1.5 -
      40,
    size,
    font,
    color: rgb(0, 0, 0),
  });
}

async function drawSchool(
  page: PDFPage,
  fontName: PDFFont,
  fontCountry: PDFFont,
  _schoolNameText: string,
  _schoolCountryText: string,
  opts: RenderOptions
) {
  const schoolNameText = fixNonWinAnsiString(_schoolNameText, fontName);
  const schoolCountryText = fixNonWinAnsiString(_schoolCountryText, fontName);

  const schoolNameTextSize = 5;
  const schoolNameTextHeight = fontName.heightAtSize(schoolNameTextSize, {
    descender: false,
  });
  const schoolNameTextWidth = fontName.widthOfTextAtSize(
    schoolNameText,
    schoolNameTextSize
  );

  const schoolNameCountrySize = 5;
  const schoolCountryTextWidth = fontCountry.widthOfTextAtSize(
    schoolCountryText,
    schoolNameCountrySize
  );
  // const schoolCountryTextHeight = font.heightAtSize(schoolNameCountrySize, {
  //  descender: false,
  // });

  page.drawText(schoolNameText, {
    x:
      opts.framePadding +
      (page.getWidth() - opts.framePadding * 2) / 4 -
      schoolNameTextWidth / 2,
    y:
      opts.framePadding +
      opts.roleBannerHeight +
      (opts.mainRectHeight - opts.roleBannerHeight) / 2 -
      opts.pictureSize / 2 -
      schoolNameTextHeight / 2 -
      4,
    size: schoolNameTextSize,
    font: fontName,
    color: rgb(0, 0, 0),
  });

  page.drawText(schoolCountryText, {
    x:
      opts.framePadding +
      (page.getWidth() - opts.framePadding * 2) / 4 -
      schoolCountryTextWidth / 2,
    y:
      opts.framePadding +
      opts.roleBannerHeight +
      (opts.mainRectHeight - opts.roleBannerHeight) / 2 -
      opts.pictureSize / 2 -
      schoolNameTextHeight -
      8,
    size: schoolNameCountrySize,
    font: fontCountry,
    color: rgb(0, 0, 0),
  });
}

function getGroupColor(group: string): RGB {
  switch (group) {
    case "secretariat":
    case "chair":
    case "hsc":
    case "guest":
      return BLUE;
    case "director":
      return RED;
    case "delegate":
      return YELLOW;
    case "staff":
      return GREEN;
    default:
      return BLUE;
  }
}
