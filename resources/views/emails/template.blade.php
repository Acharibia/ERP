<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }

        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
            margin-bottom: 20px;
        }

        .email-logo {
            max-height: 50px;
            width: auto;
        }

        .email-content {
            padding: 20px 0;
        }

        .email-footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }

        a {
            color: #3869D4;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #3869D4;
            border-radius: 5px;
            text-decoration: none;
            text-align: center;
            margin: 20px 0;
        }

        .btn:hover {
            background-color: #2d5bb9;
            text-decoration: none;
        }

        @media screen and (max-width: 600px) {
            .email-wrapper {
                width: 100%;
                border-radius: 0;
                box-shadow: none;
            }
        }
    </style>
</head>

<body>
    <div class="email-wrapper">
        <div class="email-header">
            @if (isset($data['company_logo']))
                <img src="{{ $data['company_logo'] }}" alt="{{ $data['company_name'] ?? config('app.name') }}"
                    class="email-logo">
            @else
                <h2>{{ config('app.name') }}</h2>
            @endif
        </div>

        <div class="email-content">
            {!! $content !!}
        </div>

        <div class="email-footer">
            <p>
                &copy; {{ date('Y') }} {{ $data['company_name'] ?? config('app.name') }}. All rights reserved.
            </p>
            <p>
                {{ $data['company_address'] ?? '' }}
            </p>
            @if (isset($data['unsubscribe_url']))
                <p>
                    <a href="{{ $data['unsubscribe_url'] }}">Unsubscribe</a> |
                    <a href="{{ $data['preferences_url'] ?? '#' }}">Email Preferences</a>
                </p>
            @endif
        </div>
    </div>
</body>

</html>
