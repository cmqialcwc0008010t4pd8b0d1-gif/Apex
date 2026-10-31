const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding for ApexEdge Trading Academy...");

  // 1. Platform Settings
  const platformSetting = await prisma.platformSetting.upsert({
    where: { id: "global-platform-setting" },
    update: {},
    create: {
      id: "global-platform-setting",
      siteName: "ApexEdge Trading Academy",
      tagline: "Professional, Institutional-Grade Financial & Trading Education",
      supportEmail: "support@apexedgetrading.internal",
      supportPhone: "+1-800-APEX-EDU",
      defaultCurrency: "USD",
      membershipPrice: 20.0,
      maintenanceMode: false,
      registrationEnabled: true,
      withdrawalsEnabled: false, // Held disabled until compliance verification
      complianceHoldEnabled: true,
    },
  });

  // 2. Payment Settings
  await prisma.paymentSetting.upsert({
    where: { id: "default-payment-setting" },
    update: {},
    create: {
      id: "default-payment-setting",
      amount: 20.0,
      currency: "USDT",
      bep20Address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      trc20Address: "TX9qZVa59z6W24Y2D6F7gK1mR3o9H7jL8w",
      bep20Active: true,
      trc20Active: true,
      qrCodeUrl: "/images/payment-qr-placeholder.png",
      instructions: "Transfer exactly $20 USDT to the selected network address. After your blockchain transaction confirms, copy the full Transaction Hash (TXID) and take a screenshot of your transfer confirmation. Submit both below for manual verification by our compliance officers.",
      reviewWindowNotice: "Verification is conducted manually by treasury officers. The estimated review window is 2 to 3 hours.",
    },
  });

  // 3. Commission Settings (Level 1 to 10 - Strict compliance mode)
  const commissionLevels = [
    { level: 1, percentage: 15.0 },
    { level: 2, percentage: 10.0 },
    { level: 3, percentage: 5.0 },
    { level: 4, percentage: 0.0 },
    { level: 5, percentage: 0.0 },
    { level: 6, percentage: 0.0 },
    { level: 7, percentage: 0.0 },
    { level: 8, percentage: 0.0 },
    { level: 9, percentage: 0.0 },
    { level: 10, percentage: 0.0 },
  ];

  for (const c of commissionLevels) {
    await prisma.commissionSetting.upsert({
      where: { level: c.level },
      update: { percentage: c.percentage },
      create: {
        level: c.level,
        percentage: c.percentage,
        isActive: false, // Mandated: keep disabled until legal approval
      },
    });
  }

  // 4. Bonus Settings
  const bonusSlabs = [
    {
      id: "bonus-bronze",
      title: "Bronze Direct Achiever",
      minDirectReferrals: 5,
      minTeamSize: 15,
      bonusAmount: 50.0,
      maintenanceDeductionPct: 10.0,
      periodType: "WEEKLY",
      isActive: false,
    },
    {
      id: "bonus-silver",
      title: "Silver Leadership Slab",
      minDirectReferrals: 10,
      minTeamSize: 50,
      bonusAmount: 150.0,
      maintenanceDeductionPct: 10.0,
      periodType: "WEEKLY",
      isActive: false,
    },
    {
      id: "bonus-gold",
      title: "Gold Master Slab",
      minDirectReferrals: 25,
      minTeamSize: 200,
      bonusAmount: 500.0,
      maintenanceDeductionPct: 10.0,
      periodType: "WEEKLY",
      isActive: false,
    },
  ];

  for (const b of bonusSlabs) {
    await prisma.bonusSetting.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }

  // 5. Seed Admin User
  const adminPasswordHash = await bcrypt.hash("Admin@Trading2026!", 10);
  const adminUser = await prisma.user.upsert({
    where: { mobileNumber: "+10000000000" },
    update: {},
    create: {
      uniqueUserId: "EDU100000",
      fullName: "Apex Chief Administrator",
      mobileNumber: "+10000000000",
      referralCode: "REFADMIN",
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
      accountStatus: "ACTIVE",
      membershipStatus: "ACTIVE",
      membership: {
        create: {
          status: "ACTIVE",
          price: 20.0,
          currency: "USD",
          activatedAt: new Date(),
          notes: "System Super Admin permanent membership",
        },
      },
      walletAccount: {
        create: {
          balance: 0.0,
          pendingWithdrawals: 0.0,
          totalEarned: 0.0,
          totalWithdrawn: 0.0,
        },
      },
    },
  });

  // 6. Seed Demo Student Users
  const studentPasswordHash = await bcrypt.hash("Student@123", 10);

  const student1 = await prisma.user.upsert({
    where: { mobileNumber: "+12025550101" },
    update: {},
    create: {
      uniqueUserId: "EDU100001",
      fullName: "Alexander Sterling",
      mobileNumber: "+12025550101",
      referralCode: "REF88101",
      passwordHash: studentPasswordHash,
      role: "USER",
      accountStatus: "ACTIVE",
      membershipStatus: "ACTIVE",
      membership: {
        create: {
          status: "ACTIVE",
          price: 20.0,
          currency: "USD",
          activatedAt: new Date(),
        },
      },
      walletAccount: {
        create: {
          balance: 0.0,
          pendingWithdrawals: 0.0,
          totalEarned: 0.0,
          totalWithdrawn: 0.0,
        },
      },
    },
  });

  const student2 = await prisma.user.upsert({
    where: { mobileNumber: "+12025550102" },
    update: {},
    create: {
      uniqueUserId: "EDU100002",
      fullName: "Elena Rostova",
      mobileNumber: "+12025550102",
      referralCode: "REF88102",
      passwordHash: studentPasswordHash,
      role: "USER",
      accountStatus: "ACTIVE",
      membershipStatus: "ACTIVE",
      referredById: student1.id, // Referred by student1
      membership: {
        create: {
          status: "ACTIVE",
          price: 20.0,
          currency: "USD",
          activatedAt: new Date(),
        },
      },
      walletAccount: {
        create: {
          balance: 0.0,
          pendingWithdrawals: 0.0,
          totalEarned: 0.0,
          totalWithdrawn: 0.0,
        },
      },
    },
  });

  const student3 = await prisma.user.upsert({
    where: { mobileNumber: "+12025550103" },
    update: {},
    create: {
      uniqueUserId: "EDU100003",
      fullName: "Marcus Chen",
      mobileNumber: "+12025550103",
      referralCode: "REF88103",
      passwordHash: studentPasswordHash,
      role: "USER",
      accountStatus: "ACTIVE",
      membershipStatus: "PENDING", // Pending payment
      referredById: student2.id, // Referred by student2
      membership: {
        create: {
          status: "PENDING",
          price: 20.0,
          currency: "USD",
        },
      },
      walletAccount: {
        create: {
          balance: 0.0,
          pendingWithdrawals: 0.0,
          totalEarned: 0.0,
          totalWithdrawn: 0.0,
        },
      },
    },
  });

  // Add demo payment request under review for student 3
  await prisma.paymentRequest.upsert({
    where: { txHash: "0x4a9b6c8d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b" },
    update: {},
    create: {
      userId: student3.id,
      amount: 20.0,
      currency: "USDT",
      network: "BEP20",
      receivingAddress: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      txHash: "0x4a9b6c8d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      screenshotUrl: "/images/sample-receipt.png",
      status: "UNDER_REVIEW",
      adminNotes: "Submitted by user. Awaiting on-chain transaction confirmation check.",
    },
  });

  // 7. Seed Real Courses & Text-Based Articles
  const course1 = await prisma.course.upsert({
    where: { slug: "institutional-price-action" },
    update: {},
    create: {
      title: "Foundations of Institutional Price Action",
      slug: "institutional-price-action",
      summary: "Understand market structure, liquidity engineering, order blocks and institutional flow without lagging indicators.",
      description: "This comprehensive article-based masterclass deconstructs the mechanics of price discovery. You will learn how central bank algorithms, market makers and institutional desks execute orders, identify genuine market structure shifts, and avoid retail liquidity traps.",
      category: "Price Action",
      difficulty: "Intermediate",
      estimatedHours: 6,
      isPublished: true,
      featured: true,
      orderIndex: 1,
    },
  });

  const module1_1 = await prisma.courseModule.upsert({
    where: { id: "module-market-structure" },
    update: {},
    create: {
      id: "module-market-structure",
      courseId: course1.id,
      title: "Module 1: Market Structure & Structural Shifts",
      description: "Deconstructing Higher Highs, Higher Lows, Break of Structure (BOS) and Change of Character (CHoCH).",
      orderIndex: 1,
    },
  });

  const article1_1_1 = await prisma.article.upsert({
    where: { slug: "understanding-market-structure-bos-choch" },
    update: {},
    create: {
      moduleId: module1_1.id,
      title: "Understanding Market Structure: BOS vs. CHoCH",
      slug: "understanding-market-structure-bos-choch",
      summary: "The definitive guide to identifying true structural breaks versus liquidity sweeps in trending and consolidating markets.",
      readingTimeMinutes: 8,
      keyTakeaways: "1. A true Break of Structure requires a strong candle body close beyond the prior swing point.\n2. Change of Character (CHoCH) signals early potential reversal before full trend transition.\n3. Wicks above highs often represent retail stop hunts, not genuine structural expansion.",
      orderIndex: 1,
      isPublished: true,
      content: `## 1. The Geometry of Price Discovery

Financial markets do not move in straight lines; they expand and retrace in rhythmic waves governed by liquidity and order execution. To trade like an institution, you must stop treating charts as lines on a canvas and begin viewing them as an auction process between buyers and sellers.

### What is a Swing High and Swing Low?
A **Swing High** is a peak where a candle has at least one lower high to its left and right. In institutional terminology, swing points represent pockets of concentrated resting stop orders (Buy-Side Liquidity).

* **Uptrend Formula:** Series of Higher Highs (HH) followed by Higher Lows (HL).
* **Downtrend Formula:** Series of Lower Lows (LL) followed by Lower Highs (LH).
* **Consolidation / Range:** Price bounces between equal highs (EQH) and equal lows (EQL).

> **Important Rule of Thumb:** 
> Do not label every minor tick as a swing high. Focus on high-timeframe structural pivots (4-Hour and Daily) to filter out intraday noise.

---

## 2. Break of Structure (BOS)

A **Break of Structure (BOS)** occurs when price breaks beyond a confirmed swing high in an uptrend, or a confirmed swing low in a downtrend, confirming continuation of the prevailing trend.

### Institutional Verification Criteria:
1. **Candle Body Closure:** A valid BOS is only confirmed when the full candle body closes cleanly above or below the swing point.
2. **Impulse vs. Sweep:** If only the wick pokes above the high while the body closes below, this is classified as a **Liquidity Sweep (Purge)**, not a structural expansion.
3. **Volume and Displacement:** The breaking candle should display displacement—wide spread and swift execution.

---

## 3. Change of Character (CHoCH)

A **Change of Character (CHoCH)** is the very first sign of a potential trend reversal. It occurs when:
* In an uptrend: Price breaks and closes beneath the most recent Higher Low.
* In a downtrend: Price breaks and closes above the most recent Lower High.

### Why CHoCH Matters to Risk Management:
Retail traders often enter late when a trend is exhausted. Recognizing a CHoCH allows professional risk managers to:
* Tighten stop-losses on existing trend positions.
* Wait for the subsequent retest into an order block or Fair Value Gap.
* Avoid buying at extreme premium pricing.

| Concept | Trend State | Trigger Event | Confirmation Requirement |
| :--- | :--- | :--- | :--- |
| **BOS (Bullish)** | Uptrend | Price exceeds previous swing high | Full body close above swing high |
| **BOS (Bearish)** | Downtrend | Price breaches previous swing low | Full body close below swing low |
| **CHoCH (Bullish)** | Reversal from Bear | Breaks previous Lower High | Body close above previous LH |
| **CHoCH (Bearish)** | Reversal from Bull | Breaches previous Higher Low | Body close below previous HL |

---

## 4. Key Takeaways & Practice Exercise
Before moving to the interactive challenge, inspect your preferred charting platform on the EUR/USD or BTC/USD 1-Hour chart. Identify the last three structural breaks and mark whether they closed with candle bodies or merely swept the highs with long rejection wicks.`,
    },
  });

  const article1_1_2 = await prisma.article.upsert({
    where: { slug: "liquidity-engineering-and-stop-hunts" },
    update: {},
    create: {
      moduleId: module1_1.id,
      title: "Liquidity Pools: How Institutional Liquidity is Engineered",
      slug: "liquidity-engineering-and-stop-hunts",
      summary: "Understand buy-side and sell-side liquidity pools, and why retail stop losses are targeted by institutional order books.",
      readingTimeMinutes: 10,
      keyTakeaways: "1. Institutions cannot enter million-dollar positions without counter-party volume.\n2. Retail stop-loss clusters are engineered to provide liquidity for smart money fills.\n3. Never place stops exactly at visible double tops or double bottoms.",
      orderIndex: 2,
      isPublished: true,
      content: `## 1. The Problem of Scale

When a retail trader wants to buy 0.1 lots or 1 contract, the trade is filled instantaneously. But when a tier-1 hedge fund or sovereign wealth fund wishes to accumulate $500,000,000 in currency or equity futures, they face a catastrophic problem: **Slippage**.

If an institutional entity executes a massive market buy order in a quiet market, price will shoot vertically, resulting in horrible average entry prices. Therefore, the institution must find where sellers are concentrated.

Where are the largest clusters of sellers?
* Behind old support levels as sell-stop orders (stop-losses of long traders).
* Breakout traders waiting to sell if support fails.

---

## 2. Buy-Side vs. Sell-Side Liquidity

### Buy-Side Liquidity (BSL):
Located above swing highs, resistance levels, and equal highs (EQH).
* **Who lives here?** Short sellers' stop-losses (which become market BUY orders when triggered) and breakout buyers.
* **Smart Money Action:** Institutions sell into this rush of buy orders to offload long inventory or initiate large short positions.

### Sell-Side Liquidity (SSL):
Located below swing lows, key support levels, and equal lows (EQL).
* **Who lives here?** Long traders' stop-losses (which become market SELL orders when triggered) and breakdown sellers.
* **Smart Money Action:** Institutions buy into this flood of sell orders at a steep discount.

> **Trading Epiphany:**
> If you cannot spot the liquidity in the market, **your stop-loss is the liquidity**.

---

## 3. The Liquidity Raid Anatomy
1. **Creation:** Market establishes clean double tops or support.
2. **Engineering:** Retailers feel confident and tighten stops directly behind the level.
3. **The Sweep:** A sudden rapid spike drives price through the level, triggering millions of stop orders.
4. **Displacement:** As soon as liquidity is absorbed, price aggressively reverses in the opposite direction.

Study this sequence carefully. You will test your identification skills in the Candlestick & Pattern interactive challenge.`,
    },
  });

  // Course 2: Risk Management
  const course2 = await prisma.course.upsert({
    where: { slug: "quantitative-risk-management" },
    update: {},
    create: {
      title: "Systematic Risk Management & Capital Preservation",
      slug: "quantitative-risk-management",
      summary: "The mathematical framework required to survive drawdowns, calculate risk of ruin, and achieve consistent expectancy.",
      description: "Trading success is 80% capital preservation and risk sizing. This course provides rigorous mathematical models, position sizing calculators, and risk-to-reward matrices used by professional proprietary trading desks.",
      category: "Risk Management",
      difficulty: "Beginner",
      estimatedHours: 4,
      isPublished: true,
      featured: true,
      orderIndex: 2,
    },
  });

  const module2_1 = await prisma.courseModule.upsert({
    where: { id: "module-risk-math" },
    update: {},
    create: {
      id: "module-risk-math",
      courseId: course2.id,
      title: "Module 1: The Mathematics of Drawdown",
      description: "Position sizing equations, asymmetric drawdown penalties, and the 1% sacred rule.",
      orderIndex: 1,
    },
  });

  const article2_1_1 = await prisma.article.upsert({
    where: { slug: "the-one-percent-risk-rule-and-drawdown-math" },
    update: {},
    create: {
      moduleId: module2_1.id,
      title: "The 1% Rule and The Geometry of Drawdown",
      slug: "the-one-percent-risk-rule-and-drawdown-math",
      summary: "Why a 50% loss requires a 100% gain to break even, and how strict position sizing prevents account destruction.",
      readingTimeMinutes: 6,
      keyTakeaways: "1. Drawdown recovery is non-linear; the deeper the loss, the exponentially harder the recovery.\n2. Never risk more than 1% to 2% of total capital on any single setup.\n3. Position size must adjust dynamically to the distance of your stop loss.",
      orderIndex: 1,
      isPublished: true,
      content: `## 1. Asymmetric Drawdown Recovery

Many novice traders believe that if they lose 20% of their account, a 20% gain will bring them back to break-even. This is mathematically false. Losses compound against you, while gains must be earned on a smaller remaining capital base.

### The Drawdown Reality Table:
| Account Loss (%) | Capital Remaining | Required Gain to Break Even (%) |
| :--- | :--- | :--- |
| **5%** | $950 | **5.3%** |
| **10%** | $900 | **11.1%** |
| **20%** | $800 | **25.0%** |
| **30%** | $700 | **42.9%** |
| **50%** | $500 | **100.0%** |
| **75%** | $250 | **300.0%** |
| **90%** | $100 | **900.0%** |

Once an account experiences a 50% drawdown, the psychological pressure and mathematical barrier become almost insurmountable for most humans.

---

## 2. The Universal Position Sizing Formula

Professional traders never calculate position size by arbitrary "number of lots" or gut feeling. Position size is strictly a function of:
1. Total Account Balance ($A$)
2. Maximum Risk Percentage ($R\%$, typically 1%)
3. Distance to Invalidation / Stop Loss in points or pips ($D$)

$$\\text{Position Size} = \\frac{\\text{Account Balance} \\times \\text{Risk Percentage}}{\\text{Stop Loss Distance in Dollar Value}}$$

### Example:
* Account Balance = $10,000
* Risk = 1% = $100
* Stop Loss Distance on Stock X = $2.50 per share
* Allowed Shares = $100 / $2.50 = **40 shares**

If your stop-loss is wider, your position size MUST decrease. If your stop-loss is tighter, your position size can increase while keeping risk capped at exactly $100.`,
    },
  });

  // 8. Seed Interactive Games (Extensible Engine - 8 Game Types)
  // Game 1: Terminology Matching
  const game1 = await prisma.interactiveGame.upsert({
    where: { slug: "trading-terminology-matching" },
    update: {},
    create: {
      courseId: course1.id,
      title: "Trading Terminology Matching Challenge",
      slug: "trading-terminology-matching",
      type: "TERMINOLOGY_MATCH",
      description: "Test your mastery of institutional concepts by matching financial terms with their precise definitions.",
      isPublished: true,
      orderIndex: 1,
      questions: {
        create: [
          {
            questionText: "Match the concept 'BOS (Break of Structure)' with its correct definition:",
            questionType: "MATCHING",
            optionsJson: JSON.stringify([
              "A trend continuation signal where price closes with a full candle body beyond a confirmed swing high or low.",
              "A sudden rejection wick that triggers stop losses without sustaining momentum.",
              "An area between three candles where price traded inefficiently leaving an imbalance.",
              "The average price an algorithm pays across multiple dark pools."
            ]),
            correctAnswer: "A trend continuation signal where price closes with a full candle body beyond a confirmed swing high or low.",
            explanation: "BOS confirms that order flow continues in the established direction. It requires a body close to differentiate from liquidity sweeps.",
            orderIndex: 1,
          },
          {
            questionText: "Match 'Fair Value Gap (FVG)' with its true market mechanics:",
            questionType: "MATCHING",
            optionsJson: JSON.stringify([
              "A 3-candle price imbalance where only one side of the market was delivered, leaving an unfilled price void.",
              "The spread charged by your broker during high volatility news events.",
              "The closing price of yesterday minus the opening price of today.",
              "A support line drawn from the 200 EMA."
            ]),
            correctAnswer: "A 3-candle price imbalance where only one side of the market was delivered, leaving an unfilled price void.",
            explanation: "Fair Value Gaps represent price inefficiency where heavy aggressive buying or selling skipped two-sided auctioning. Price frequently retraces to balance these gaps.",
            orderIndex: 2,
          },
          {
            questionText: "Match 'Drawdown' with its accurate mathematical definition:",
            questionType: "MATCHING",
            optionsJson: JSON.stringify([
              "The peak-to-trough decline during a specific record period of an investment or trading account.",
              "The fee paid to an exchange when executing a withdrawal request.",
              "The maximum leverage allowed by a margin broker.",
              "The daily overnight swap fee charged on spot currencies."
            ]),
            correctAnswer: "The peak-to-trough decline during a specific record period of an investment or trading account.",
            explanation: "Drawdown measures the pain and capital erosion between the highest account equity peak and the lowest trough before a new peak is achieved.",
            orderIndex: 3,
          }
        ],
      },
    },
  });

  // Game 2: Candlestick Pattern Identification
  const game2 = await prisma.interactiveGame.upsert({
    where: { slug: "candlestick-pattern-identification" },
    update: {},
    create: {
      courseId: course1.id,
      title: "Candlestick Pattern Identification",
      slug: "candlestick-pattern-identification",
      type: "CANDLESTICK_PATTERN",
      description: "Evaluate live price action scenarios and identify key candlestick structural rejections.",
      isPublished: true,
      orderIndex: 2,
      questions: {
        create: [
          {
            questionText: "Price rallies to a multi-day resistance level, prints a candle with a very long upper wick (2.5x body length) and closes near the low of the session. What pattern is this?",
            questionType: "IDENTIFICATION",
            optionsJson: JSON.stringify([
              "Bearish Pin Bar / Shooting Star (Liquidity Rejection)",
              "Bullish Marubozu",
              "Doji Indecision",
              "Inside Bar Continuation"
            ]),
            correctAnswer: "Bearish Pin Bar / Shooting Star (Liquidity Rejection)",
            explanation: "The long upper wick indicates that buyers attempted to push higher, but institutions entered aggressive market sell orders, absorbing all demand and driving price down.",
            orderIndex: 1,
          },
          {
            questionText: "A small red candle is followed immediately by a tall green candle whose body completely encloses the preceding red candle's high and low. What pattern does this represent?",
            questionType: "IDENTIFICATION",
            optionsJson: JSON.stringify([
              "Bullish Engulfing Pattern",
              "Bearish Harami",
              "Hanging Man",
              "Evening Star"
            ]),
            correctAnswer: "Bullish Engulfing Pattern",
            explanation: "Bullish Engulfing demonstrates an overwhelming shift from selling pressure to aggressive institutional buying displacement.",
            orderIndex: 2,
          }
        ],
      },
    },
  });

  // Game 3: Risk Management Challenge
  const game3 = await prisma.interactiveGame.upsert({
    where: { slug: "risk-management-challenge" },
    update: {},
    create: {
      courseId: course2.id,
      title: "Risk Management Challenge",
      slug: "risk-management-challenge",
      type: "RISK_MANAGEMENT",
      description: "Solve practical capital preservation and position sizing challenges under simulated market constraints.",
      isPublished: true,
      orderIndex: 3,
      questions: {
        create: [
          {
            questionText: "You have a $25,000 trading account. You adhere to a strict 1% risk rule. You identify a setup with a 50-pip stop loss where 1 pip = $10 per standard lot. How many lots can you trade?",
            questionType: "CALCULATION",
            optionsJson: JSON.stringify([
              "0.5 Lots ($250 total risk / $500 per lot stop = 0.50)",
              "2.0 Lots ($1,000 total risk)",
              "1.0 Lot ($500 total risk)",
              "5.0 Lots ($2,500 total risk)"
            ]),
            correctAnswer: "0.5 Lots ($250 total risk / $500 per lot stop = 0.50)",
            explanation: "1% of $25,000 is $250. At 50 pips, 1 standard lot risks $500. Therefore, you must trade $250 / $500 = 0.5 lots to keep risk precisely at 1%.",
            orderIndex: 1,
          },
          {
            questionText: "Your trading account suffers a 25% drawdown. What exact percentage gain must you generate on the remaining equity to return to your original high water mark?",
            questionType: "CALCULATION",
            optionsJson: JSON.stringify([
              "33.33% Gain",
              "25.00% Gain",
              "50.00% Gain",
              "12.50% Gain"
            ]),
            correctAnswer: "33.33% Gain",
            explanation: "If an account falls from $100 to $75 (25% loss), gaining $25 back on a $75 balance equals 25 / 75 = 33.33%.",
            orderIndex: 2,
          }
        ],
      },
    },
  });

  // Game 4: True or False Challenge
  const game4 = await prisma.interactiveGame.upsert({
    where: { slug: "market-truth-challenge" },
    update: {},
    create: {
      courseId: course2.id,
      title: "Market Truths: True or False",
      slug: "market-truth-challenge",
      type: "TRUE_FALSE",
      description: "Separate institutional realities from retail myths.",
      isPublished: true,
      orderIndex: 4,
      questions: {
        create: [
          {
            questionText: "A trader can have a win rate of only 40% and still be consistently profitable over 100 trades.",
            questionType: "TRUE_FALSE",
            optionsJson: JSON.stringify(["True", "False"]),
            correctAnswer: "True",
            explanation: "With a Risk-to-Reward ratio of 1:2.5 or higher, a 40% win rate yields high positive expectancy. (40 wins x 2.5R = +100R, 60 losses x 1R = -60R. Net profit = +40R).",
            orderIndex: 1,
          },
          {
            questionText: "Adding to a losing position (averaging down) is a recommended technique for preserving long-term trading capital.",
            questionType: "TRUE_FALSE",
            optionsJson: JSON.stringify(["True", "False"]),
            correctAnswer: "False",
            explanation: "Averaging down violates invalidation principles and exponentially increases the probability of catastrophic account destruction (risk of ruin).",
            orderIndex: 2,
          }
        ],
      },
    },
  });

  // 9. Daily Learning Schedule
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  await prisma.dailyLearning.upsert({
    where: { date: todayStr },
    update: {},
    create: {
      date: todayStr,
      title: "Today's Focus: Market Structure Shifts & Risk Geometry",
      description: "Complete today's reading on BOS vs CHoCH and validate your understanding with the Terminology Matching Challenge.",
      articleId: article1_1_1.id,
      gameId: game1.id,
      unlockCondition: "NONE",
      isPublished: true,
    },
  });

  // 10. CMS Pages Content
  const cmsEntries = [
    {
      key: "home_hero",
      title: "Professional Financial & Trading Education",
      content: JSON.stringify({
        headline: "Institutional-Grade Trading Education Built for True Market Edge",
        subheadline: "Master market structure, liquidity mechanics, and systematic risk preservation through article-based deep dives and interactive educational simulations.",
        badge: "Verified Institutional Curriculum",
        ctaPrimaryText: "Explore Curriculum",
        ctaSecondaryText: "Activate Membership ($20)",
      }),
      metaTitle: "ApexEdge Trading Academy - Financial Education Platform",
      metaDescription: "Master trading with article-based structured courses, interactive challenges, and professional risk management.",
    },
    {
      key: "about_us",
      title: "About ApexEdge Trading Academy",
      content: `ApexEdge Trading Academy is an independent educational institution founded on the premise that financial literacy and risk management are the only sustainable competitive advantages in modern markets.

We reject get-rich-quick claims, automated bots, and speculative hype. Instead, our curriculum is engineered around empirical market microstructure: order book mechanics, liquidity engineering, and mathematical risk management.

Our goal is simple: transform aspirational learners into disciplined, self-sufficient analysts capable of navigating global equities, futures, foreign exchange, and digital asset markets.`,
      metaTitle: "About Us | ApexEdge Trading Academy",
      metaDescription: "Learn about our mission, principles, and disciplined approach to trading education.",
    },
    {
      key: "terms",
      title: "Terms and Conditions",
      content: `### 1. Educational Nature of Services
ApexEdge Trading Academy strictly provides non-advisory educational content, articles, and learning simulations. We are NOT a broker-dealer, financial advisor, investment manager, or custodian. No information presented on this platform constitutes an offer to buy or sell securities, commodities, or cryptocurrencies.

### 2. User Accounts & Responsibilities
Each student receives a permanent Unique Student ID. Account credentials must remain confidential. Multiple registrations or fraudulent manipulation of referral tracking are strictly prohibited.

### 3. Membership & Non-Investment Policy
The $20 membership fee covers digital educational materials, article access, and interactive quizzes. Membership fees are not investment deposits, capital contributions, or yielding assets. No profit sharing or financial yields are offered or guaranteed.

### 4. Direct Selling & Referral Compliance
Referral program features remain in configuration mode subject to local direct-selling and consumer protection regulatory compliance. Payouts are not disbursed from registration funds.`,
      metaTitle: "Terms and Conditions | ApexEdge Trading Academy",
      metaDescription: "Read the official terms and conditions governing the use of ApexEdge Trading Academy.",
    },
    {
      key: "risk_disclosure",
      title: "Risk Disclosure Notice",
      content: `### IMPORTANT REGULATORY NOTICE ON FINANCIAL TRADING RISK

Trading financial instruments, foreign exchange (Forex), commodities, options, and digital assets carries a very high level of risk and may not be suitable for all individuals.

1. **High Risk of Capital Loss:** You may sustain a total loss of your initial funds. Never speculate with capital you cannot afford to lose completely.
2. **No Guaranteed Results:** Past performance, historical examples, or educational simulations do not guarantee future market results.
3. **Hypothetical Performance:** The interactive challenges and quizzes provided within this platform are simulated and educational. They do not simulate live slippage, execution delays, exchange liquidity gaps, or psychological pressure.
4. **Independent Due Diligence:** Always seek independent advice from a certified financial consultant before making live capital commitments.`,
      metaTitle: "Risk Disclosure Statement | ApexEdge Trading Academy",
      metaDescription: "Important disclosures regarding the high risk of financial trading and speculative markets.",
    },
    {
      key: "refund_policy",
      title: "Refund Policy",
      content: `### Digital Content Refund Policy
Because our educational articles, interactive simulations, and platform frameworks are made available upon manual review and account activation, the following refund standards apply:

1. **Unactivated Accounts:** If your manual payment has not yet been approved and you wish to cancel, you may contact our compliance team within 24 hours of submission for a full return of unprocessed funds minus network transfer gas fees.
2. **Activated Accounts:** Once membership access is granted and digital intellectual property has been accessed, fees are non-refundable.
3. **Dispute Resolution:** In the event of duplicate blockchain transfers, submit a support ticket with both transaction hashes for treasury reconciliation.`,
      metaTitle: "Refund Policy | ApexEdge Trading Academy",
      metaDescription: "Our policy regarding digital course materials and manual payment requests.",
    },
  ];

  for (const cms of cmsEntries) {
    await prisma.cmsContent.upsert({
      where: { key: cms.key },
      update: cms,
      create: cms,
    });
  }

  // 11. Initial Support Ticket for Demo
  await prisma.supportTicket.upsert({
    where: { ticketNumber: "TKT-1001" },
    update: {},
    create: {
      ticketNumber: "TKT-1001",
      userId: student2.id,
      subject: "Inquiry regarding Module 2 article release schedule",
      category: "Course",
      priority: "LOW",
      status: "OPEN",
      messages: {
        create: {
          senderId: student2.id,
          senderRole: "USER",
          message: "Hello team, I just completed the Market Structure article. When will the Order Block volume study be released?",
        },
      },
    },
  });

  console.log("Database seeded successfully!");
  console.log("Admin credentials: Mobile: +10000000000 | Password: Admin@Trading2026! | Unique ID: EDU100000");
  console.log("Student credentials: Mobile: +12025550101 | Password: Student@123 | Unique ID: EDU100001");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
